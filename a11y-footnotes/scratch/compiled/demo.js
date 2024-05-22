/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/demo/ts/Demo.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/demo/ts/Demo.ts":
/*!*****************************!*\
  !*** ./src/demo/ts/Demo.ts ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_ts_Plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../main/ts/Plugin */ "./src/main/ts/Plugin.ts");

Object(_main_ts_Plugin__WEBPACK_IMPORTED_MODULE_0__["default"])();
tinymce.init({
    selector: 'textarea.tinymce',
    plugins: 'code a11y-footnotes',
    toolbar: 'a11y-footnotes'
});


/***/ }),

/***/ "./src/main/ts/Plugin.ts":
/*!*******************************!*\
  !*** ./src/main/ts/Plugin.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const setup = (editor, url) => {
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
    editor.ui.registry.addIcon('custom-footnote-icon', '<img src="/a11y-footnotes/icons/footnote.svg" style="height: 28px; width: 28px;"/>');
    // Function to insert a footnote
    function insertFootnote(selectedText, footnoteText) {
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
        }
        else {
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
            const refElement = ref;
            const sup = ref.querySelector('sup');
            if (sup) {
                sup.textContent = `[${index + 1}]`;
            }
            refElement.href = `#footnote-entry-${index + 1}`;
            refElement.id = `footnote-entry-${index + 1}-ref`;
        });
        const footnotes = editor.dom.select('li[id^="footnote-"]');
        footnotes.forEach((footnote, index) => {
            const footnoteElement = footnote;
            footnoteElement.id = `footnote-entry-${index + 1}`;
            const backlink = footnote.querySelector('a[role="doc-backlink"]');
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
                editor.windowManager.confirm('The reference number for this footnote has been deleted. Do you want to delete the footnote as well?', function (state) {
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
/* harmony default export */ __webpack_exports__["default"] = (() => {
    tinymce.PluginManager.add('a11y-footnotes', setup);
});


/***/ })

/******/ });
//# sourceMappingURL=demo.js.map