import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
    let footnoteCounter = 1;

    // Inject CSS for footnotes
    const css = `
        .footnote-highlight {
            background-color: yellow !important;
        }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    editor.ui.registry.addButton('a11y-footnotes', {
        text: 'Footnote',
        onAction: () => {
            const selectedText = editor.selection.getContent({ format: 'text' });
            if (!selectedText) {
                editor.windowManager.alert('Please select a word or text to add a footnote.');
                return;
            }

            editor.windowManager.open({
                title: 'Insert Footnote',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'input',
                            name: 'footnoteText',
                            label: 'Footnote Text'
                        }
                    ]
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: 'Cancel'
                    },
                    {
                        type: 'submit',
                        text: 'Save',
                        primary: true
                    }
                ],
                onSubmit: function (api) {
                    const data = api.getData();
                    insertFootnote(selectedText, data.footnoteText);
                    api.close();
                }
            });
        }
    });

    function insertFootnote(selectedText: string, footnoteText: string) {
        const footnoteId = 'footnote-' + (new Date()).getTime();
        const footnoteNumber = footnoteCounter++;
        const footnoteMarker = `<span>${selectedText}<a id="footnote-entry-${footnoteId}-ref" role="doc-noteref" aria-labelledby="footnote-entry-${footnoteId}" href="#footnote-entry-${footnoteId}"><sup>[${footnoteNumber}]</sup></a></span>`;
        const footnoteContent = `
            <li id="footnote-entry-${footnoteId}">
                <a id="footnote-entry-${footnoteId}">
                    
                </a>
                <span contenteditable="true">${footnoteText}</span>
                <a role="doc-backlink" href="#footnote-entry-${footnoteId}-ref" aria-label="Back to content">↵</a>
            </li>`;

        editor.insertContent(footnoteMarker);

        const footnotesSection = editor.dom.select('section[role="doc-footnotes"] ol')[0];
        if (footnotesSection) {
            footnotesSection.innerHTML += footnoteContent;
        } else {
            editor.setContent(editor.getContent() + `<hr /><section role="doc-footnotes" aria-label="footnotes" contenteditable="false">
                <h3 class="sr-only" id="footnotes-block-${footnoteId}">Footnotes</h3>
                <ol>${footnoteContent.trim()}</ol>
            </section>`);
        }
    }

    function removeOrphanFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        const footnoteIds = footnoteRefs.map(ref => ref.id.replace('-ref', ''));

        const footnotes = editor.dom.select('li[id^="footnote-"]');
        footnotes.forEach(footnote => {
            const footnoteId = footnote.id;
            if (!footnoteIds.includes(footnoteId)) {
                editor.dom.remove(footnote);
            }
        });

        // Remove empty footnotes section
        const footnotesSection = editor.dom.select('section[role="doc-footnotes"]')[0];
        if (footnotesSection && footnotesSection.querySelectorAll('li').length === 0) {
            editor.dom.remove(footnotesSection);
        }
    }

    editor.on('input', removeOrphanFootnotes);
};

export default (): void => {
    tinymce.PluginManager.add('a11y-footnotes', setup);
};
