"use strict";

exports.default = void 0;
var _inAppMessageConsequenceAdapter = require("./consequenceAdapters/inAppMessageConsequenceAdapter.js");
var _schemaTypeConsequenceAdapter = require("./consequenceAdapters/schemaTypeConsequenceAdapter.js");
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

const CJM_IN_APP_MESSAGE_TYPE = "cjmiam";
const SCHEMA = "schema";
const adapters = {
  [CJM_IN_APP_MESSAGE_TYPE]: _inAppMessageConsequenceAdapter.default,
  [SCHEMA]: _schemaTypeConsequenceAdapter.default
};
var _default = () => {
  return consequence => {
    const {
      id,
      type,
      detail
    } = consequence;
    return typeof adapters[type] === "function" ? adapters[type](id, type, detail) : detail;
  };
};
exports.default = _default;