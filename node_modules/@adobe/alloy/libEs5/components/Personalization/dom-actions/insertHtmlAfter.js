"use strict";

exports.default = void 0;
var _index = require("./dom/index.js");
var _images = require("./images.js");
var _addNonceToInlineStyleElements = require("./addNonceToInlineStyleElements.js");
var _scripts = require("./scripts.js");
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
var _default = (container, html, decorateProposition) => {
  const fragment = (0, _index.createFragment)(html);
  (0, _addNonceToInlineStyleElements.default)(fragment);
  const elements = (0, _index.getChildNodes)(fragment);
  const scripts = (0, _scripts.getInlineScripts)(fragment);
  const scriptsUrls = (0, _scripts.getRemoteScriptsUrls)(fragment);
  (0, _images.loadImages)(fragment);
  let insertionPoint = container;
  elements.forEach(element => {
    decorateProposition(element);
    (0, _index.insertAfter)(insertionPoint, element);
    insertionPoint = element;
  });
  (0, _scripts.executeInlineScripts)(container, scripts);
  return (0, _scripts.executeRemoteScripts)(scriptsUrls);
};
exports.default = _default;