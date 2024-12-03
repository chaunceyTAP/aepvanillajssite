"use strict";

exports.default = exports.DOM_ACTION_SET_TEXT = exports.DOM_ACTION_SET_STYLE = exports.DOM_ACTION_SET_IMAGE_SOURCE = exports.DOM_ACTION_SET_HTML = exports.DOM_ACTION_SET_ATTRIBUTE = exports.DOM_ACTION_RESIZE = exports.DOM_ACTION_REPLACE_HTML = exports.DOM_ACTION_REMOVE = exports.DOM_ACTION_REARRANGE = exports.DOM_ACTION_PREPEND_HTML = exports.DOM_ACTION_MOVE = exports.DOM_ACTION_INSERT_BEFORE = exports.DOM_ACTION_INSERT_AFTER = exports.DOM_ACTION_CUSTOM_CODE = exports.DOM_ACTION_COLLECT_INTERACTIONS = exports.DOM_ACTION_CLICK = exports.DOM_ACTION_APPEND_HTML = void 0;
var _index = require("../../../utils/dom/index.js");
var _setHtml = require("./setHtml.js");
var _prependHtml = require("./prependHtml.js");
var _action = require("./action.js");
var _setText = require("./setText.js");
var _setAttributes = require("./setAttributes.js");
var _swapImage = require("./swapImage.js");
var _setStyles = require("./setStyles.js");
var _move = require("./move.js");
var _rearrangeChildren = require("./rearrangeChildren.js");
var _insertHtmlAfter = require("./insertHtmlAfter.js");
var _insertHtmlBefore = require("./insertHtmlBefore.js");
var _replaceHtml = require("./replaceHtml.js");
var _appendHtml = require("./appendHtml.js");
var _collectInteractions = require("./collectInteractions.js");
var _resize = require("./resize.js");
/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const DOM_ACTION_SET_HTML = exports.DOM_ACTION_SET_HTML = "setHtml";
const DOM_ACTION_CUSTOM_CODE = exports.DOM_ACTION_CUSTOM_CODE = "customCode";
const DOM_ACTION_SET_TEXT = exports.DOM_ACTION_SET_TEXT = "setText";
const DOM_ACTION_SET_ATTRIBUTE = exports.DOM_ACTION_SET_ATTRIBUTE = "setAttribute";
const DOM_ACTION_SET_IMAGE_SOURCE = exports.DOM_ACTION_SET_IMAGE_SOURCE = "setImageSource";
const DOM_ACTION_SET_STYLE = exports.DOM_ACTION_SET_STYLE = "setStyle";
const DOM_ACTION_MOVE = exports.DOM_ACTION_MOVE = "move";
const DOM_ACTION_RESIZE = exports.DOM_ACTION_RESIZE = "resize";
const DOM_ACTION_REARRANGE = exports.DOM_ACTION_REARRANGE = "rearrange";
const DOM_ACTION_REMOVE = exports.DOM_ACTION_REMOVE = "remove";
const DOM_ACTION_INSERT_AFTER = exports.DOM_ACTION_INSERT_AFTER = "insertAfter";
const DOM_ACTION_INSERT_BEFORE = exports.DOM_ACTION_INSERT_BEFORE = "insertBefore";
const DOM_ACTION_REPLACE_HTML = exports.DOM_ACTION_REPLACE_HTML = "replaceHtml";
const DOM_ACTION_PREPEND_HTML = exports.DOM_ACTION_PREPEND_HTML = "prependHtml";
const DOM_ACTION_APPEND_HTML = exports.DOM_ACTION_APPEND_HTML = "appendHtml";
const DOM_ACTION_CLICK = exports.DOM_ACTION_CLICK = "click";
const DOM_ACTION_COLLECT_INTERACTIONS = exports.DOM_ACTION_COLLECT_INTERACTIONS = "collectInteractions";
var _default = () => {
  return {
    [DOM_ACTION_SET_HTML]: (0, _action.createAction)(_setHtml.default),
    [DOM_ACTION_CUSTOM_CODE]: (0, _action.createAction)(_prependHtml.default),
    [DOM_ACTION_SET_TEXT]: (0, _action.createAction)(_setText.default),
    [DOM_ACTION_SET_ATTRIBUTE]: (0, _action.createAction)(_setAttributes.default),
    [DOM_ACTION_SET_IMAGE_SOURCE]: (0, _action.createAction)(_swapImage.default),
    [DOM_ACTION_SET_STYLE]: (0, _action.createAction)(_setStyles.default),
    [DOM_ACTION_MOVE]: (0, _action.createAction)(_move.default),
    [DOM_ACTION_RESIZE]: (0, _action.createAction)(_resize.default),
    [DOM_ACTION_REARRANGE]: (0, _action.createAction)(_rearrangeChildren.default),
    [DOM_ACTION_REMOVE]: (0, _action.createAction)(_index.removeNode),
    [DOM_ACTION_INSERT_AFTER]: (0, _action.createAction)(_insertHtmlAfter.default),
    [DOM_ACTION_INSERT_BEFORE]: (0, _action.createAction)(_insertHtmlBefore.default),
    [DOM_ACTION_REPLACE_HTML]: (0, _action.createAction)(_replaceHtml.default),
    [DOM_ACTION_PREPEND_HTML]: (0, _action.createAction)(_prependHtml.default),
    [DOM_ACTION_APPEND_HTML]: (0, _action.createAction)(_appendHtml.default),
    [DOM_ACTION_COLLECT_INTERACTIONS]: (0, _action.createAction)(_collectInteractions.default)
  };
};
exports.default = _default;