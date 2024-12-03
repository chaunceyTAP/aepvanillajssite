"use strict";

Object.defineProperty(exports, "appendHtml", {
  enumerable: true,
  get: function () {
    return _appendHtml.default;
  }
});
exports.createAction = void 0;
Object.defineProperty(exports, "insertHtmlAfter", {
  enumerable: true,
  get: function () {
    return _insertHtmlAfter.default;
  }
});
Object.defineProperty(exports, "insertHtmlBefore", {
  enumerable: true,
  get: function () {
    return _insertHtmlBefore.default;
  }
});
Object.defineProperty(exports, "prependHtml", {
  enumerable: true,
  get: function () {
    return _prependHtml.default;
  }
});
Object.defineProperty(exports, "rearrangeChildren", {
  enumerable: true,
  get: function () {
    return _rearrangeChildren.default;
  }
});
Object.defineProperty(exports, "replaceHtml", {
  enumerable: true,
  get: function () {
    return _replaceHtml.default;
  }
});
Object.defineProperty(exports, "setAttributes", {
  enumerable: true,
  get: function () {
    return _setAttributes.default;
  }
});
Object.defineProperty(exports, "setHtml", {
  enumerable: true,
  get: function () {
    return _setHtml.default;
  }
});
Object.defineProperty(exports, "setStyles", {
  enumerable: true,
  get: function () {
    return _setStyles.default;
  }
});
Object.defineProperty(exports, "setText", {
  enumerable: true,
  get: function () {
    return _setText.default;
  }
});
Object.defineProperty(exports, "swapImage", {
  enumerable: true,
  get: function () {
    return _swapImage.default;
  }
});
var _index = require("../../../utils/dom/index.js");
var _index2 = require("../flicker/index.js");
var _index3 = require("./dom/index.js");
var _setText = require("./setText.js");
var _setHtml = require("./setHtml.js");
var _appendHtml = require("./appendHtml.js");
var _prependHtml = require("./prependHtml.js");
var _replaceHtml = require("./replaceHtml.js");
var _insertHtmlBefore = require("./insertHtmlBefore.js");
var _insertHtmlAfter = require("./insertHtmlAfter.js");
var _setStyles = require("./setStyles.js");
var _setAttributes = require("./setAttributes.js");
var _swapImage = require("./swapImage.js");
var _rearrangeChildren = require("./rearrangeChildren.js");
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

const renderContent = (elements, content, decorateProposition, renderFunc) => {
  const executions = elements.map(element => renderFunc(element, content, decorateProposition));
  return Promise.all(executions);
};
const createAction = renderFunc => {
  return (itemData, decorateProposition) => {
    const {
      selector,
      prehidingSelector,
      content
    } = itemData;
    (0, _index2.hideElements)(prehidingSelector);
    return (0, _index.awaitSelector)(selector, _index3.selectNodesWithEq).then(elements => renderContent(elements, content, decorateProposition, renderFunc)).then(() => {
      // if everything is OK, show elements
      (0, _index2.showElements)(prehidingSelector);
    }, error => {
      // in case of awaiting timing or error, we need to remove the style tag
      // hence showing the pre-hidden elements
      (0, _index2.showElements)(prehidingSelector);
      throw error;
    });
  };
};
exports.createAction = createAction;