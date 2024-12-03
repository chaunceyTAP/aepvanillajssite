"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _highEntropyUserAgentClientHints = require("../../constants/highEntropyUserAgentClientHints.js");
/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const browserSupportsUserAgentClientHints = navigator => {
  return typeof navigator.userAgentData !== "undefined";
};
var _default = navigator => {
  if (!browserSupportsUserAgentClientHints(navigator)) {
    return _index.noop;
  }
  return (xdm, logger) => {
    try {
      return navigator.userAgentData.getHighEntropyValues(_highEntropyUserAgentClientHints.default.map(hint => hint[0])).then(hints => {
        const userAgentClientHints = {};
        _highEntropyUserAgentClientHints.default.forEach(([hintName, hintType]) => {
          if (Object.prototype.hasOwnProperty.call(hints, hintName) && /* eslint-disable-next-line valid-typeof */
          typeof hints[hintName] === hintType) {
            userAgentClientHints[hintName] = hints[hintName];
          }
        });
        (0, _index.deepAssign)(xdm, {
          environment: {
            browserDetails: {
              userAgentClientHints
            }
          }
        });
      });
    } catch (error) {
      logger.warn("Unable to collect user-agent client hints. " + error.message);
      return _index.noop;
    }
  };
};
exports.default = _default;