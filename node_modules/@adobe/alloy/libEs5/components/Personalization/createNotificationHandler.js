"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _eventType = require("../../constants/eventType.js");
var _isNonEmptyArray = require("../../utils/isNonEmptyArray.js");
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
var _default = (collect, renderedPropositions) => {
  return (isRenderDecisions, isSendDisplayEvent, viewName) => {
    if (!isRenderDecisions) {
      // If we aren't rendering anything, then we don't need to sendDisplayEvents.
      return () => undefined;
    }
    if (!isSendDisplayEvent) {
      const renderedPropositionsDeferred = (0, _index.defer)();
      renderedPropositions.concat(renderedPropositionsDeferred.promise);
      return renderedPropositionsDeferred.resolve;
    }
    return (decisionsMetaDisplay = [], decisionsMetaSuppressed = []) => {
      if ((0, _isNonEmptyArray.default)(decisionsMetaDisplay)) {
        collect({
          decisionsMeta: decisionsMetaDisplay,
          viewName
        });
      }
      if ((0, _isNonEmptyArray.default)(decisionsMetaSuppressed)) {
        collect({
          decisionsMeta: decisionsMetaSuppressed,
          eventType: _eventType.SUPPRESS,
          propositionAction: {
            reason: "Conflict"
          },
          viewName
        });
      }
    };
  };
};
exports.default = _default;