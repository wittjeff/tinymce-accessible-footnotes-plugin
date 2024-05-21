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

    // SVG Icon for the button
    // const footnoteIcon = `
    //     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" viewBox="0 0 32 40" version="1.1" xml:space="preserve" style="" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
    //         <g transform="matrix(0.264583,0,0,0.264583,0,0)">
    //             <path d="M3.794,0C1.721,-0.008 0.008,1.691 0,3.765L0,117.151C-0.008,119.224 1.691,120.937 3.765,120.945L86.937,120.945C89.01,120.937 90.709,119.224 90.701,117.151L90.701,26.449C90.701,25.444 90.3,24.479 89.587,23.77L66.932,1.115C66.218,0.412 65.253,0.022 64.252,0.03L3.794,0ZM7.559,7.559L60.458,7.589L60.458,26.449C60.45,28.548 62.153,30.252 64.252,30.244L83.142,30.244L83.142,113.386L7.559,113.386L7.559,7.559ZM68.017,12.904L77.805,22.685L68.017,22.685L68.017,12.904ZM22.478,37.803C17.437,38.063 17.828,45.629 22.869,45.369L41.567,45.369C46.608,45.369 46.608,37.803 41.567,37.803L22.869,37.803C22.739,37.796 22.608,37.796 22.478,37.803ZM97.899,45.369C93.205,45.9 93.537,52.821 98.26,52.899L113.386,52.899L113.386,83.142L105.34,83.142L108.979,77.672C109.41,77.043 109.641,76.298 109.641,75.536C109.641,73.463 107.935,71.757 105.862,71.757C105.821,71.757 105.779,71.758 105.738,71.759C104.496,71.796 103.349,72.443 102.675,73.487L95.108,84.847C94.27,86.111 94.27,87.762 95.108,89.026L102.675,100.357C103.37,101.438 104.571,102.093 105.857,102.093C107.933,102.093 109.641,100.385 109.641,98.309C109.641,97.546 109.41,96.801 108.979,96.171L105.325,90.701L117.151,90.701C119.239,90.71 120.938,89.025 120.945,86.937L120.945,49.134C120.938,47.046 119.239,45.36 117.151,45.369L98.26,45.369C98.139,45.363 98.019,45.363 97.899,45.369ZM22.293,52.928C17.611,53.484 17.969,60.389 22.685,60.458L67.707,60.458C73.171,60.919 73.171,52.467 67.707,52.928L22.685,52.928C22.554,52.921 22.423,52.921 22.293,52.928ZM22.685,75.583C22.679,75.583 22.674,75.583 22.669,75.583C20.596,75.583 18.89,77.289 18.89,79.362C18.89,79.367 18.89,79.372 18.89,79.377L18.89,94.496C18.898,96.563 20.601,98.26 22.669,98.26C22.674,98.26 22.679,98.26 22.685,98.26L71.818,98.26C73.881,98.253 75.576,96.558 75.583,94.496L75.583,79.377C75.583,79.372 75.583,79.367 75.583,79.362C75.583,77.294 73.886,75.591 71.818,75.583L22.685,75.583ZM26.449,83.142L68.017,83.142L68.017,90.701L26.449,90.701L26.449,83.142Z"/>
    //         </g>
    //     </svg>
    // `;

    editor.ui.registry.addButton('a11y-footnotes', {
        icon: 'footnote', // Add custom icon
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

        reorderFootnotes();
    }

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

    editor.on('input', removeOrphanFootnotes);
};

export default (): void => {
    tinymce.PluginManager.add('a11y-footnotes', setup);
};
