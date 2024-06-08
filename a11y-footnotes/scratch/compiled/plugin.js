(function () {
    'use strict';

    const setup = (editor, url) => {
      let footnoteCounter = 1;
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
        icon: 'custom-footnote-icon',
        tooltip: 'Insert Footnote',
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
              items: [{
                  type: 'input',
                  name: 'footnoteText',
                  label: 'Footnote Text'
                }]
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
      editor.ui.registry.addIcon('custom-footnote-icon', '<img src="../../../icons/footnote.svg" style="height: 25px; width: 25px; vertical-align: middle;"/>');
      function insertFootnote(selectedText, footnoteText) {
        const footnoteId = 'footnote-' + new Date().getTime();
        const footnoteNumber = footnoteCounter++;
        const footnoteMarker = `<span>${ selectedText }<a id="footnote-entry-${ footnoteId }-ref" role="doc-noteref" aria-labelledby="footnote-entry-${ footnoteId }" href="#footnote-entry-${ footnoteId }"><sup>[${ footnoteNumber }]</sup></a></span>`;
        const footnoteContent = `
            <li id="footnote-entry-${ footnoteId }">
                <span contenteditable="true">${ footnoteText }</span>
                <a role="doc-backlink" href="#footnote-entry-${ footnoteId }-ref" aria-label="Back to content">\u21b5</a>
            </li>`;
        editor.insertContent(footnoteMarker);
        const footnotesSection = editor.dom.select('section[role="doc-footnotes"] ol')[0];
        if (footnotesSection) {
          footnotesSection.innerHTML += footnoteContent;
        } else {
          editor.setContent(editor.getContent() + `<hr /><section role="doc-footnotes" aria-label="footnotes" contenteditable="false">
                <h3 class="sr-only" id="footnotes-block-${ footnoteId }">Footnotes</h3>
                <ol>${ footnoteContent.trim() }</ol>
            </section>`);
        }
        reorderFootnotes();
      }
      function reorderFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        const footnotes = editor.dom.select('li[id^="footnote-"]');
        if (footnoteRefs.length !== footnotes.length) {
          console.error('Mismatch between number of footnote references and footnotes');
        } else {
          let refElement = footnoteRefs[0];
          let footnoteElement = footnotes[footnotes.length - 1];
          if (refElement.href.endsWith(`#${ footnoteElement.id }`)) {
            re_odering(footnoteRefs, footnoteElement, 0);
            for (let index = 1; index < footnoteRefs.length; index++) {
              footnoteElement = footnotes[index - 1];
              re_odering(footnoteRefs, footnoteElement, index);
            }
            list_sort();
          } else {
            refElement = footnoteRefs[footnoteRefs.length - 1];
            footnoteElement = footnotes[footnotes.length - 1];
            if (!refElement.href.endsWith(`#${ footnoteElement.id }`)) {
              for (let index = 0; index < footnoteRefs.length; index++) {
                refElement = footnoteRefs[index];
                footnoteElement = footnotes[footnotes.length - 1];
                if (refElement.href.endsWith(`#${ footnoteElement.id }`)) {
                  re_odering(footnoteRefs, footnoteElement, index);
                  for (let indx = index + 1; indx < footnoteRefs.length; indx++) {
                    footnoteElement = footnotes[indx - 1];
                    re_odering(footnoteRefs, footnoteElement, indx);
                  }
                  break;
                }
              }
              list_sort();
            }
          }
        }
      }
      function re_odering(footnoteRefs, footnoteElement, index) {
        const refElement = footnoteRefs[index];
        const sup = footnoteRefs[index].querySelector('sup');
        if (sup) {
          sup.textContent = `[${ index + 1 }]`;
        }
        refElement.href = `#footnote-entry-${ index + 1 }`;
        refElement.id = `footnote-entry-${ index + 1 }-ref`;
        refElement.setAttribute('data-mce-href', `#footnote-entry-${ index + 1 }`);
        refElement.setAttribute('aria-labelledby', `#footnote-entry-footnote-${ index + 1 }`);
        footnoteElement.id = `footnote-entry-${ index + 1 }`;
        const backlink = footnoteElement.querySelector('a[role="doc-backlink"]');
        if (backlink) {
          backlink.href = `#footnote-entry-${ index + 1 }-ref`;
          backlink.setAttribute('data-mce-href', `#footnote-entry-${ index + 1 }-ref`);
          backlink.setAttribute('aria-label', `="Back to content`);
        }
      }
      function list_sort() {
        const footnoteLists = editor.dom.select('ol');
        const footnotes = editor.dom.select('li[id^="footnote-"]');
        footnotes.sort((a, b) => {
          const aIdNumber = parseInt(a.id.split('-').pop(), 10);
          const bIdNumber = parseInt(b.id.split('-').pop(), 10);
          return aIdNumber - bIdNumber;
        });
        footnoteLists.forEach(footnoteList => {
          while (footnoteList.firstChild) {
            footnoteList.removeChild(footnoteList.firstChild);
          }
          footnotes.forEach(footnote => {
            footnoteList.appendChild(footnote);
          });
        });
      }
      function removeOrphanFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        const footnotes = editor.dom.select('li[id^="footnote-"]');
        if (footnoteRefs.length < footnotes.length) {
          if (footnoteRefs.length == 0) {
            remove_child(footnotes, 0);
          } else {
            for (let index = 0; index < footnotes.length; index++) {
              let refElement = footnoteRefs[index];
              let footnoteElement = footnotes[index];
              if (!refElement.href.endsWith(`#${ footnoteElement.id }`)) {
                remove_child(footnotes, index);
                for (let indx = index + 1; index < footnotes.length; indx++) {
                  refElement = footnoteRefs[indx];
                  footnoteElement = footnotes[indx];
                  re_odering(footnoteRefs, footnoteElement, indx - 1);
                }
                break;
              }
            }
          }
        }
      }
      function remove_child(footnotes, index) {
        footnotes[index].parentNode.removeChild(footnotes[index]);
      }
      editor.on('input', removeOrphanFootnotes);
    };
    var Plugin = () => {
      tinymce.PluginManager.add('a11y-footnotes', setup);
    };

    Plugin();

})();
