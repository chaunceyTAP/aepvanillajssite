"use strict";

exports.loadImages = exports.loadImage = exports.isImage = void 0;
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

const isImage = element => element.tagName === _tagName.IMG;
exports.isImage = isImage;
const loadImage = url => {
  return (0, _index.createNode)(_tagName.IMG, {
    src: url
  });
};
exports.loadImage = loadImage;
const loadImages = fragment => {
  const images = (0, _index.selectNodes)(_tagName.IMG, fragment);
  images.forEach(image => {
    const url = (0, _index2.getAttribute)(image, _elementAttribute.SRC);
    if (url) {
      loadImage(url);
    }
  });
};
exports.loadImages = loadImages;