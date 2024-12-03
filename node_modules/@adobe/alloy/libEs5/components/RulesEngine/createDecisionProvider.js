"use strict";

exports.default = void 0;
var _createEvaluableRulesetPayload = require("./createEvaluableRulesetPayload.js");
var _createDecisionHistory = require("./createDecisionHistory.js");
var _utils = require("./utils.js");
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
  eventRegistry
}) => {
  const payloadsBasedOnActivityId = {};
  const decisionHistory = (0, _createDecisionHistory.default)({
    eventRegistry
  });
  const addPayload = payload => {
    const activityId = (0, _utils.getActivityId)(payload);
    if (!activityId) {
      return;
    }
    const evaluableRulesetPayload = (0, _createEvaluableRulesetPayload.default)(payload, eventRegistry, decisionHistory);
    if (evaluableRulesetPayload.isEvaluable) {
      payloadsBasedOnActivityId[activityId] = evaluableRulesetPayload;
    }
  };
  const evaluate = (context = {}) => {
    const sortedPayloadsBasedOnActivityId = Object.values(payloadsBasedOnActivityId).sort(({
      rank: rankA
    }, {
      rank: rankB
    }) => rankA - rankB);
    return sortedPayloadsBasedOnActivityId.map(payload => payload.evaluate(context)).filter(payload => payload.items.length > 0);
  };
  const addPayloads = personalizationPayloads => {
    personalizationPayloads.forEach(addPayload);
  };
  return {
    addPayload,
    addPayloads,
    evaluate
  };
};
exports.default = _default;