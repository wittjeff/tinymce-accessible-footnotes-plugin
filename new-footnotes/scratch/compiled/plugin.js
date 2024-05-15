(function () {
    'use strict';

    var setup = function (editor, url) {
      var footnoteCounter = 1;
      editor.ui.registry.addButton('new-footnotes', {
        text: 'Footnote',
        onAction: function () {
          var selectedText = editor.selection.getContent({ format: 'text' });
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
              var data = api.getData();
              insertFootnote(selectedText, data.footnoteText);
              api.close();
            }
          });
        }
      });
      function insertFootnote(selectedText, footnoteText) {
        var footnoteId = 'footnote-' + new Date().getTime();
        var footnoteNumber = footnoteCounter++;
        var footnoteMarker = '<span>'.concat(selectedText, '<a id="footnote-entry-').concat(footnoteId, '-ref" role="doc-noteref" aria-label="footnote-entry-').concat(footnoteId, '" href="#footnote-entry-').concat(footnoteId, '"><sup>[').concat(footnoteNumber, ']</sup></a></span>');
        var footnoteContent = '\n            <li>\n                <a id="footnote-entry-'.concat(footnoteId, '">\n                    \n                </a>\n                ').concat(footnoteText, '\n                <a role="doc-backlink" href="#footnote-entry-').concat(footnoteId, '-ref" aria-label="Back to content">\u21B5</a>\n            </li>');
        editor.insertContent(footnoteMarker);
        var footnotesSection = editor.dom.select('section[role="doc-footnotes"] ol')[0];
        if (footnotesSection) {
          footnotesSection.innerHTML += footnoteContent;
        } else {
          editor.setContent(editor.getContent() + '<hr /><section role="doc-footnotes" aria-label="footnotes">\n                <h3 class="sr-only" id="footnotes-block-'.concat(footnoteId, '">Footnotes</h3>\n                <ol>').concat(footnoteContent.trim(), '</ol>\n            </section>'));
        }
      }
    };
    function Plugin () {
      tinymce.PluginManager.add('new-footnotes', setup);
    }

    Plugin();

})();
