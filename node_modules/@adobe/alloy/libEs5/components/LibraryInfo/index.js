"use strict";

exports.default = void 0;
var _libraryVersion = require("../../constants/libraryVersion.js");
var _coreCommands = require("../../constants/coreCommands.js");
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

const prepareLibraryInfo = ({
  config,
  componentRegistry
}) => {
  const allCommands = [...componentRegistry.getCommandNames(), _coreCommands.CONFIGURE, _coreCommands.SET_DEBUG].sort();
  const resultConfig = {
    ...config
  };
  Object.keys(config).forEach(key => {
    const value = config[key];
    if (typeof value !== "function") {
      return;
    }
    resultConfig[key] = value.toString();
  });
  const components = componentRegistry.getComponentNames();
  return {
    version: _libraryVersion.default,
    configs: resultConfig,
    commands: allCommands,
    components
  };
};
const createLibraryInfo = ({
  config,
  componentRegistry
}) => {
  return {
    commands: {
      getLibraryInfo: {
        run: () => {
          return {
            libraryInfo: prepareLibraryInfo({
              config,
              componentRegistry
            })
          };
        }
      }
    }
  };
};
createLibraryInfo.namespace = "LibraryInfo";
var _default = exports.default = createLibraryInfo;