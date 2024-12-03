"use strict";

exports.default = void 0;
var _index = require("../../../utils/index.js");
var _index2 = require("../../../utils/validation/index.js");
var _ecidNamespace = require("../../../constants/ecidNamespace.js");
var _coreNamespace = require("../../../constants/coreNamespace.js");
/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Verifies user provided event options.
 * @param {*} options The user event options to validate
 * @returns {*} Validated options
 */

const validator = (0, _index2.objectOf)({
  namespaces: (0, _index2.arrayOf)((0, _index2.enumOf)(_ecidNamespace.default, _coreNamespace.default)).nonEmpty().uniqueItems().default([_ecidNamespace.default]),
  edgeConfigOverrides: _index.validateConfigOverride
}).noUnknownFields().default({
  namespaces: [_ecidNamespace.default]
});
var _default = ({
  thirdPartyCookiesEnabled
}) => {
  return options => {
    const validatedOptions = validator(options);
    if (!thirdPartyCookiesEnabled && validatedOptions.namespaces.includes(_coreNamespace.default)) {
      throw new Error("namespaces: The " + _coreNamespace.default + " namespace cannot be requested when third-party cookies are disabled.");
    }
    return validatedOptions;
  };
};
exports.default = _default;