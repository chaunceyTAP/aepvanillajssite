"use strict";

exports.default = void 0;
var _injectWeb = require("./injectWeb.js");
var _injectDevice = require("./injectDevice.js");
var _injectEnvironment = require("./injectEnvironment.js");
var _injectPlaceContext = require("./injectPlaceContext.js");
var _injectTimestamp = require("./injectTimestamp.js");
var _implementationDetails = require("./implementationDetails.js");
var _createComponent = require("./createComponent.js");
var _injectHighEntropyUserAgentHints = require("./injectHighEntropyUserAgentHints.js");
var _index = require("../../utils/validation/index.js");
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

const web = (0, _injectWeb.default)(window);
const device = (0, _injectDevice.default)(window);
const environment = (0, _injectEnvironment.default)(window);
const placeContext = (0, _injectPlaceContext.default)(() => new Date());
const timestamp = (0, _injectTimestamp.default)(() => new Date());
const highEntropyUserAgentHints = (0, _injectHighEntropyUserAgentHints.default)(navigator);
const defaultEnabledContexts = {
  web,
  device,
  environment,
  placeContext
};
const defaultDisabledContexts = {
  highEntropyUserAgentHints
};
const optionalContexts = {
  ...defaultEnabledContexts,
  ...defaultDisabledContexts
};
const requiredContexts = [timestamp, _implementationDetails.default];
const createContext = ({
  config,
  logger
}) => {
  return (0, _createComponent.default)(config, logger, optionalContexts, requiredContexts);
};
createContext.namespace = "Context";
createContext.configValidators = (0, _index.objectOf)({
  context: (0, _index.arrayOf)((0, _index.string)()).default(Object.keys(defaultEnabledContexts))
});
var _default = exports.default = createContext;