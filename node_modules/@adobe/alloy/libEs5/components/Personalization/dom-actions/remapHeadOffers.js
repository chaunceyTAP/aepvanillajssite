"use strict";

exports.default = void 0;
var _index = require("../../../utils/dom/index.js");
var _scripts = require("./scripts.js");
var _index2 = require("./dom/index.js");
var _isBlankString = require("../../../utils/isBlankString.js");
var _tagName = require("../../../constants/tagName.js");
var _initDomActionsModules = require("./initDomActionsModules.js");
/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/*
 * Preprocess actions before rendering, so that offers are remapped to appendHtml when these are
 * to be applied to page HEAD, to align with the way it works in at.js.
 * Offer content should also be filtered, so that only tags allowed in HEAD are preserved.
 */

const HEAD_TAGS_SELECTOR = "SCRIPT,LINK,STYLE";
const filterHeadContent = content => {
  const container = (0, _index2.createFragment)(content);
  const headNodes = (0, _index.selectNodes)(HEAD_TAGS_SELECTOR, container);
  return headNodes.map(node => node.outerHTML).join("");
};
var _default = action => {
  const result = {
    ...action
  };
  const {
    content,
    selector
  } = result;
  if ((0, _isBlankString.default)(content)) {
    return result;
  }
  if (selector == null) {
    return result;
  }
  const container = (0, _index2.selectNodesWithEq)(selector);
  if (!(0, _scripts.is)(container[0], _tagName.HEAD)) {
    return result;
  }
  result.type = _initDomActionsModules.DOM_ACTION_APPEND_HTML;
  result.content = filterHeadContent(content);
  return result;
};
exports.default = _default;