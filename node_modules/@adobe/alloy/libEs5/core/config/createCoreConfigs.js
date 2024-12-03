"use strict";

exports.default = void 0;
var _index = require("../../utils/validation/index.js");
var _index2 = require("../../utils/index.js");
var _domain = require("../../constants/domain.js");
var _edgeBasePath = require("../../constants/edgeBasePath.js");
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
var _default = () => (0, _index.objectOf)({
  debugEnabled: (0, _index.boolean)().default(false),
  datastreamId: (0, _index.string)().unique().required(),
  edgeDomain: (0, _index.string)().domain().default(_domain.EDGE),
  edgeBasePath: (0, _index.string)().nonEmpty().default(_edgeBasePath.default),
  orgId: (0, _index.string)().unique().required(),
  onBeforeEventSend: (0, _index.callback)().default(_index2.noop),
  edgeConfigOverrides: _index2.validateConfigOverride
}).renamed("edgeConfigId", (0, _index.string)().unique(), "datastreamId");
exports.default = _default;