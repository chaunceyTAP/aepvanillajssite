"use strict";

exports.createInstance = exports.createCustomInstance = exports.components = void 0;
var _index = require("./core/index.js");
var _createLogger = require("./core/createLogger.js");
var _createLogController = require("./core/createLogController.js");
var _index2 = require("./utils/index.js");
var _index3 = require("./utils/validation/index.js");
var optionalComponents = require("./core/componentCreators.js");
exports.components = optionalComponents;
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

// This file is used to rollup the code into an ES module version to be used by other npm projects
// like the launch extension. Everything that is exported here can be used independently by other
// npm projects.

const {
  console
} = window;
const createNamespacedStorage = (0, _index2.injectStorage)(window);
const createCustomInstance = (options = {}) => {
  const eventOptionsValidator = (0, _index3.objectOf)({
    name: (0, _index3.string)().default("alloy"),
    monitors: (0, _index3.arrayOf)((0, _index3.objectOf)({})).default([]),
    components: (0, _index3.arrayOf)((0, _index3.callback)())
  }).noUnknownFields();
  const {
    name,
    monitors,
    components
  } = eventOptionsValidator(options);

  // this is a function so that window.__alloyMonitors can be set or added to at any time
  // eslint-disable-next-line no-underscore-dangle
  const getMonitors = () => (window.__alloyMonitors || []).concat(monitors);
  const logController = (0, _createLogController.default)({
    console,
    locationSearch: window.location.search,
    createLogger: _createLogger.default,
    instanceName: name,
    createNamespacedStorage,
    getMonitors
  });
  const instance = (0, _index.createExecuteCommand)({
    instanceName: name,
    logController,
    components
  });
  logController.logger.logOnInstanceCreated({
    instance
  });
  return instance;
};
exports.createCustomInstance = createCustomInstance;
const createInstance = (options = {}) => {
  const eventOptionsValidator = (0, _index3.objectOf)({
    name: (0, _index3.string)().default("alloy"),
    monitors: (0, _index3.arrayOf)((0, _index3.objectOf)({})).default([])
  }).noUnknownFields();
  const {
    name,
    monitors
  } = eventOptionsValidator(options);
  return createCustomInstance({
    name,
    monitors,
    components: Object.values(optionalComponents)
  });
};
exports.createInstance = createInstance;