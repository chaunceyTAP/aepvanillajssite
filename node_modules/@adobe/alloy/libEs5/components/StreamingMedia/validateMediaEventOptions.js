"use strict";

exports.default = void 0;
var _index = require("../../utils/validation/index.js");
var _eventTypes = require("./constants/eventTypes.js");
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
var _default = ({
  options
}) => {
  const validator = (0, _index.anyOf)([(0, _index.objectOf)({
    playerId: (0, _index.string)().required(),
    xdm: (0, _index.objectOf)({
      eventType: (0, _index.enumOf)(...Object.values(_eventTypes.default)).required(),
      mediaCollection: (0, _index.objectOf)((0, _index.anything)())
    }).required()
  }).required(), (0, _index.objectOf)({
    xdm: (0, _index.objectOf)({
      eventType: (0, _index.enumOf)(...Object.values(_eventTypes.default)).required(),
      mediaCollection: (0, _index.objectOf)({
        playhead: (0, _index.number)().integer().required(),
        sessionID: (0, _index.string)().required()
      }).required()
    }).required()
  }).required()], "Error validating the sendMediaEvent command options.");
  return validator(options);
};
exports.default = _default;