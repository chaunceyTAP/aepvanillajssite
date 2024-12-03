"use strict";

exports.default = void 0;
var _index = require("../../../utils/dom/index.js");
var _tagName = require("../../../constants/tagName.js");
var _elementAttribute = require("../../../constants/elementAttribute.js");
var _index2 = require("./dom/index.js");
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

const is = (element, tagName) => element.tagName === tagName;
const isInlineStyleElement = element => is(element, _tagName.STYLE) && !(0, _index2.getAttribute)(element, _elementAttribute.SRC);
var _default = fragment => {
  const styleNodes = (0, _index.selectNodes)(_tagName.STYLE, fragment);
  const {
    length
  } = styleNodes;
  const nonce = (0, _index2.getNonce)();
  if (!nonce) {
    return;
  }
  /* eslint-disable no-continue */
  for (let i = 0; i < length; i += 1) {
    const element = styleNodes[i];
    if (!isInlineStyleElement(element)) {
      continue;
    }
    element.nonce = nonce;
  }
};
exports.default = _default;