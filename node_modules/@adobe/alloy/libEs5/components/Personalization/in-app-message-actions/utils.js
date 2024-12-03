"use strict";

exports.removeElementById = exports.parseAnchor = void 0;
var _index = require("../../../utils/index.js");
var _index2 = require("../../../utils/dom/index.js");
var _decodeUriComponentSafely = require("../../../utils/decodeUriComponentSafely.js");
/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const removeElementById = id => {
  const element = (0, _index2.selectNodes)("#" + id, document);
  if (element && element.length > 0) {
    (0, _index2.removeNode)(element[0]);
  }
};
exports.removeElementById = removeElementById;
const parseAnchor = anchor => {
  const nothing = {};
  if (!anchor || anchor.tagName.toLowerCase() !== "a") {
    return nothing;
  }
  const {
    href
  } = anchor;
  if (!href || !href.startsWith("adbinapp://")) {
    return nothing;
  }
  const hrefParts = href.split("?");
  const action = hrefParts[0].split("://")[1];
  const label = anchor.innerText;
  const uuid = anchor.getAttribute("data-uuid") || "";
  let interaction;
  let link;
  if ((0, _index.isNonEmptyArray)(hrefParts)) {
    const queryParams = _index.queryString.parse(hrefParts[1]);
    interaction = queryParams.interaction || "";
    link = (0, _decodeUriComponentSafely.default)(queryParams.link || "");
  }
  return {
    action,
    interaction,
    link,
    label,
    uuid
  };
};
exports.parseAnchor = parseAnchor;