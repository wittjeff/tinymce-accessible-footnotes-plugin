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
    editor.ui.registry.addIcon('custom-footnote-icon', '<img src="../../../icons/footnote.svg" style="height: 28px; width: 28px;"/>');
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
    function reorderFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        const footnotes = editor.dom.select('li[id^="footnote-"]');
        if (footnoteRefs.length !== footnotes.length) {
            console.error('Mismatch between number of footnote references and footnotes');
        }
        else {
            let refElement = footnoteRefs[0];
            let footnoteElement = footnotes[footnotes.length - 1];
            if (refElement.href.endsWith(`#${footnoteElement.id}`)) {
                re_odering(footnoteRefs, footnoteElement, 0);
                for (let index = 1; index < footnoteRefs.length; index++) {
                    footnoteElement = footnotes[index - 1];
                    re_odering(footnoteRefs, footnoteElement, index);
                }
                list_sort();
            }
            else {
                refElement = footnoteRefs[footnoteRefs.length - 1];
                footnoteElement = footnotes[footnotes.length - 1];
                if (!refElement.href.endsWith(`#${footnoteElement.id}`)) {
                    for (let index = 0; index < footnoteRefs.length; index++) {
                        refElement = footnoteRefs[index];
                        footnoteElement = footnotes[footnotes.length - 1];
                        if (refElement.href.endsWith(`#${footnoteElement.id}`)) {
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
            sup.textContent = `[${index + 1}]`;
        }
        refElement.href = `#footnote-entry-${index + 1}`;
        refElement.id = `footnote-entry-${index + 1}-ref`;
        refElement.setAttribute('data-mce-href', `#footnote-entry-${index + 1}`);
        refElement.setAttribute('aria-labelledby', `#footnote-entry-footnote-${index + 1}`);
        footnoteElement.id = `footnote-entry-${index + 1}`;
        const backlink = footnoteElement.querySelector('a[role="doc-backlink"]');
        if (backlink) {
            backlink.href = `#footnote-entry-${index + 1}-ref`;
            backlink.setAttribute('data-mce-href', `#footnote-entry-${index + 1}-ref`);
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
    // Function to remove orphan footnotes (those without references)
    function removeOrphanFootnotes() {
        const footnoteRefs = editor.dom.select('a[role="doc-noteref"]');
        const footnotes = editor.dom.select('li[id^="footnote-"]');
        if (footnoteRefs.length < footnotes.length) {
            if (footnoteRefs.length == 0) {
                remove_child(footnotes, 0);
            }
            else {
                for (let index = 0; index < footnotes.length; index++) {
                    let refElement = footnoteRefs[index];
                    let footnoteElement = footnotes[index];
                    if (!refElement.href.endsWith(`#${footnoteElement.id}`)) {
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
// Register the plugin with TinyMCE
/* harmony default export */ __webpack_exports__["default"] = (() => {
    tinymce.PluginManager.add('a11y-footnotes', setup);
});


/***/ })

/******/ });
//# sourceMappingURL=demo.js.map