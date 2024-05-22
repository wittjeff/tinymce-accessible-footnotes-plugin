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

    // Add a button to the TinyMCE toolbar for inserting footnotes
    editor.ui.registry.addButton('a11y-footnotes', {
        icon: 'custom-footnote-icon',
        tooltip: 'Insert Footnote',
        onAction: () => {
            const selectedText = editor.selection.getContent({ format: 'text' });
            if (!selectedText) {
                editor.windowManager.alert('Please select a word or text to add a footnote.');
                return;
            }

            // Open a dialog to enter footnote text
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

    // Add the custom SVG icon
    editor.ui.registry.addIcon('custom-footnote-icon', '<img src="/a11y-footnotes/icons/footnote.svg" style="height: 28px; width: 28px;"/>')

    // Function to insert a footnote
    function insertFootnote(selectedText: string, footnoteText: string) {
        const footnoteId = 'footnote-' + (new Date()).getTime();
        const footnoteNumber = footnoteCounter++;
        const footnoteMarker = `<span>${selectedText}<a id="footnote-entry-${footnoteId}-ref" role="doc-noteref" aria-labelledby="footnote-entry-${footnoteId}" href="#footnote-entry-${footnoteId}"><sup>[${footnoteNumber}]</sup></a></span>`;
        const footnoteContent = `
            <li id="footnote-entry-${footnoteId}">
                <span contenteditable="true">${footnoteText}</span>
                <a role="doc-backlink" href="#footnote-entry-${footnoteId}-ref" aria-label="Back to content">↵</a>
            </li>`;

        editor.insertContent(footnoteMarker);

        // Add the footnote to the footnotes section or create a new section if it doesn't exist
        const footnotesSection = editor.dom.select('section[role="doc-footnotes"] ol')[0];
        if (footnotesSection) {
            footnotesSection.innerHTML += footnoteContent;
        } else {
            editor.setContent(editor.getContent() + `<hr /><section role="doc-footnotes" aria-label="footnotes" contenteditable="false">
                <h3 class="sr-only" id="footnotes-block-${footnoteId}">Footnotes</h3>
                <ol>${footnoteContent.trim()}</ol>
            </section>`);
        }

        reorderFootnotes();
    }

    // Function to reorder footnotes and update their references
    function reorderFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        footnoteRefs.forEach((ref, index) => {
            const refElement = ref as HTMLAnchorElement;
            const sup = ref.querySelector('sup');
            if (sup) {
                sup.textContent = `[${index + 1}]`;
            }
            refElement.href = `#footnote-entry-${index + 1}`;
            refElement.id = `footnote-entry-${index + 1}-ref`;
        });

        const footnotes = editor.dom.select('li[id^="footnote-"]');
        footnotes.forEach((footnote, index) => {
            const footnoteElement = footnote as HTMLLIElement;
            footnoteElement.id = `footnote-entry-${index + 1}`;
            const backlink = footnote.querySelector('a[role="doc-backlink"]') as HTMLAnchorElement;
            if (backlink) {
                backlink.href = `#footnote-entry-${index + 1}-ref`;
            }
        });
    }

    // Function to remove orphan footnotes (those without references)
    function removeOrphanFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        const footnoteIds = footnoteRefs.map(ref => ref.id.replace('-ref', ''));

        const footnotes = editor.dom.select('li[id^="footnote-"]');
        footnotes.forEach(footnote => {
            const footnoteId = footnote.id;
            if (!footnoteIds.includes(footnoteId)) {
                editor.windowManager.confirm('The reference number for this footnote has been deleted. Do you want to delete the footnote as well?', function(state) {
                    if (state) {
                        editor.dom.remove(footnote);
                    }
                });
            }
        });

        // Remove empty footnotes section
        const footnotesSection = editor.dom.select('section[role="doc-footnotes"]')[0];
        if (footnotesSection && footnotesSection.querySelectorAll('li').length === 0) {
            editor.dom.remove(footnotesSection);
        }

        reorderFootnotes();
    }

    // Listen for input events to handle removal of orphan footnotes
    editor.on('input', removeOrphanFootnotes);
};

// Register the plugin with TinyMCE
export default (): void => {
    tinymce.PluginManager.add('a11y-footnotes', setup);
};
