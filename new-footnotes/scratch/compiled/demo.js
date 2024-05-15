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
    plugins: 'code new-footnotes',
    toolbar: 'new-footnotes'
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
                    var data = api.getData();
                    insertFootnote(selectedText, data.footnoteText);
                    api.close();
                }
            });
        }
    });
    function insertFootnote(selectedText, footnoteText) {
        var footnoteId = 'footnote-' + (new Date()).getTime();
        var footnoteNumber = footnoteCounter++;
        var footnoteMarker = "<span>".concat(selectedText, "<a id=\"footnote-entry-").concat(footnoteId, "-ref\" role=\"doc-noteref\" aria-label=\"footnote-entry-").concat(footnoteId, "\" href=\"#footnote-entry-").concat(footnoteId, "\"><sup>[").concat(footnoteNumber, "]</sup></a></span>");
        var footnoteContent = "\n            <li>\n                <a id=\"footnote-entry-".concat(footnoteId, "\">\n                    \n                </a>\n                ").concat(footnoteText, "\n                <a role=\"doc-backlink\" href=\"#footnote-entry-").concat(footnoteId, "-ref\" aria-label=\"Back to content\">\u21B5</a>\n            </li>");
        editor.insertContent(footnoteMarker);
        var footnotesSection = editor.dom.select('section[role="doc-footnotes"] ol')[0];
        if (footnotesSection) {
            footnotesSection.innerHTML += footnoteContent;
        }
        else {
            editor.setContent(editor.getContent() + "<hr /><section role=\"doc-footnotes\" aria-label=\"footnotes\">\n                <h3 class=\"sr-only\" id=\"footnotes-block-".concat(footnoteId, "\">Footnotes</h3>\n                <ol>").concat(footnoteContent.trim(), "</ol>\n            </section>"));
        }
    }
};
/* harmony default export */ __webpack_exports__["default"] = (function () {
    tinymce.PluginManager.add('new-footnotes', setup);
});


/***/ })

/******/ });
//# sourceMappingURL=demo.js.map