"use strict";

exports.is = exports.getRemoteScriptsUrls = exports.getInlineScripts = exports.executeRemoteScripts = exports.executeInlineScripts = void 0;
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

const getPromise = (url, script) => {
  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve(script);
    };
    script.onerror = () => {
      reject(new Error("Failed to load script: " + url));
    };
  });
};
const loadScript = url => {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  const promise = getPromise(url, script);
  document.head.appendChild(script);
  return promise;
};
const is = (element, tagName) => !!element && element.tagName === tagName;
exports.is = is;
const isInlineScript = element => is(element, _tagName.SCRIPT) && !(0, _index2.getAttribute)(element, _elementAttribute.SRC);
const isRemoteScript = element => is(element, _tagName.SCRIPT) && (0, _index2.getAttribute)(element, _elementAttribute.SRC);
const getInlineScripts = fragment => {
  const scripts = (0, _index.selectNodes)(_tagName.SCRIPT, fragment);
  const result = [];
  const {
    length
  } = scripts;
  const nonce = (0, _index2.getNonce)();
  const attributes = {
    ...(nonce && {
      nonce
    })
  };

  /* eslint-disable no-continue */
  for (let i = 0; i < length; i += 1) {
    const element = scripts[i];
    if (!isInlineScript(element)) {
      continue;
    }
    const {
      textContent
    } = element;
    if (!textContent) {
      continue;
    }
    result.push((0, _index.createNode)(_tagName.SCRIPT, attributes, {
      textContent
    }));
  }
  /* eslint-enable no-continue */

  return result;
};
exports.getInlineScripts = getInlineScripts;
const getRemoteScriptsUrls = fragment => {
  const scripts = (0, _index.selectNodes)(_tagName.SCRIPT, fragment);
  const result = [];
  const {
    length
  } = scripts;

  /* eslint-disable no-continue */
  for (let i = 0; i < length; i += 1) {
    const element = scripts[i];
    if (!isRemoteScript(element)) {
      continue;
    }
    const url = (0, _index2.getAttribute)(element, _elementAttribute.SRC);
    if (!url) {
      continue;
    }
    result.push(url);
  }
  /* eslint-enable no-continue */

  return result;
};
exports.getRemoteScriptsUrls = getRemoteScriptsUrls;
const executeInlineScripts = (parent, scripts) => {
  scripts.forEach(script => {
    parent.appendChild(script);
    parent.removeChild(script);
  });
};
exports.executeInlineScripts = executeInlineScripts;
const executeRemoteScripts = urls => {
  return Promise.all(urls.map(loadScript));
};
exports.executeRemoteScripts = executeRemoteScripts;