"use strict";

exports.default = exports.canUseRequestAnimationFrame = exports.canUseMutationObserver = exports.awaitUsingTimer = exports.awaitUsingRequestAnimation = exports.awaitUsingMutationObserver = void 0;
var _isFunction = require("../isFunction.js");
var _isNonEmptyArray = require("../isNonEmptyArray.js");
var _selectNodes = require("./selectNodes.js");
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

const MUTATION_OBSERVER = "MutationObserver";
const RAF = "requestAnimationFrame";
const MUTATION_OBSERVER_CONFIG = {
  childList: true,
  subtree: true
};
const VISIBILITY_STATE = "visibilityState";
const VISIBLE = "visible";
const DELAY = 100;
const MAX_POLLING_TIMEOUT = 5000;
const createError = selector => {
  return new Error("Could not find: " + selector);
};
const createPromise = executor => {
  return new Promise(executor);
};
const canUseMutationObserver = win => {
  return (0, _isFunction.default)(win[MUTATION_OBSERVER]);
};
exports.canUseMutationObserver = canUseMutationObserver;
const awaitUsingMutationObserver = (win, doc, selector, timeout, selectFunc) => {
  return createPromise((resolve, reject) => {
    let timer;
    const mutationObserver = new win[MUTATION_OBSERVER](() => {
      const nodes = selectFunc(selector);
      if ((0, _isNonEmptyArray.default)(nodes)) {
        mutationObserver.disconnect();
        if (timer) {
          clearTimeout(timer);
        }
        resolve(nodes);
      }
    });
    timer = setTimeout(() => {
      mutationObserver.disconnect();
      reject(createError(selector));
    }, timeout);
    mutationObserver.observe(doc, MUTATION_OBSERVER_CONFIG);
  });
};
exports.awaitUsingMutationObserver = awaitUsingMutationObserver;
const canUseRequestAnimationFrame = doc => {
  return doc[VISIBILITY_STATE] === VISIBLE;
};
exports.canUseRequestAnimationFrame = canUseRequestAnimationFrame;
const awaitUsingRequestAnimation = (win, selector, timeout, selectFunc) => {
  return createPromise((resolve, reject) => {
    const execute = () => {
      const nodes = selectFunc(selector);
      if ((0, _isNonEmptyArray.default)(nodes)) {
        resolve(nodes);
        return;
      }
      win[RAF](execute);
    };
    execute();
    setTimeout(() => {
      reject(createError(selector));
    }, timeout);
  });
};
exports.awaitUsingRequestAnimation = awaitUsingRequestAnimation;
const awaitUsingTimer = (selector, timeout, selectFunc) => {
  return createPromise((resolve, reject) => {
    const execute = () => {
      const nodes = selectFunc(selector);
      if ((0, _isNonEmptyArray.default)(nodes)) {
        resolve(nodes);
        return;
      }
      setTimeout(execute, DELAY);
    };
    execute();
    setTimeout(() => {
      reject(createError(selector));
    }, timeout);
  });
};
exports.awaitUsingTimer = awaitUsingTimer;
var _default = (selector, selectFunc = _selectNodes.default, timeout = MAX_POLLING_TIMEOUT, win = window, doc = document) => {
  const nodes = selectFunc(selector);
  if ((0, _isNonEmptyArray.default)(nodes)) {
    return Promise.resolve(nodes);
  }
  if (canUseMutationObserver(win)) {
    return awaitUsingMutationObserver(win, doc, selector, timeout, selectFunc);
  }
  if (canUseRequestAnimationFrame(doc)) {
    return awaitUsingRequestAnimation(win, selector, timeout, selectFunc);
  }
  return awaitUsingTimer(selector, timeout, selectFunc);
};
exports.default = _default;