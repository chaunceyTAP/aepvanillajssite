"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _createOnResponseHandler = require("./createOnResponseHandler.js");
var _createDecisionProvider = require("./createDecisionProvider.js");
var _createApplyResponse = require("./createApplyResponse.js");
var _createEventRegistry = require("./createEventRegistry.js");
var _createContextProvider = require("./createContextProvider.js");
var _createSubscribeRulesetItems = require("./createSubscribeRulesetItems.js");
var _constants = require("./constants.js");
var _createEvaluateRulesetsCommand = require("./createEvaluateRulesetsCommand.js");
var _utils = require("./utils.js");
var _index2 = require("../../utils/validation/index.js");
var _createCollect = require("../../utils/createCollect.js");
var _event = require("../../utils/event.js");
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

const createRulesEngine = ({
  config,
  eventManager,
  createNamespacedStorage,
  consent,
  getBrowser
}) => {
  const {
    orgId,
    personalizationStorageEnabled
  } = config;
  const collect = (0, _createCollect.default)({
    eventManager,
    mergeDecisionsMeta: _event.mergeDecisionsMeta
  });
  const storage = createNamespacedStorage((0, _index.sanitizeOrgIdForCookieName)(orgId) + ".decisioning.");
  if (!personalizationStorageEnabled) {
    (0, _utils.clearLocalStorage)(storage.persistent);
  }
  const eventRegistry = (0, _createEventRegistry.default)({
    storage: (0, _utils.createInMemoryStorage)()
  });
  const decisionProvider = (0, _createDecisionProvider.default)({
    eventRegistry
  });
  const contextProvider = (0, _createContextProvider.default)({
    eventRegistry,
    window,
    getBrowser
  });
  const evaluateRulesetsCommand = (0, _createEvaluateRulesetsCommand.default)({
    contextProvider,
    decisionProvider
  });
  const subscribeRulesetItems = (0, _createSubscribeRulesetItems.default)({
    collect
  });
  let applyResponse;
  return {
    lifecycle: {
      onDecision({
        propositions
      }) {
        subscribeRulesetItems.refresh(propositions);
      },
      onComponentsRegistered(tools) {
        applyResponse = (0, _createApplyResponse.default)(tools.lifecycle);
        if (personalizationStorageEnabled) {
          consent.awaitConsent().then(() => {
            eventRegistry.setStorage(storage.persistent);
          }).catch(() => {
            if (storage) {
              (0, _utils.clearLocalStorage)(storage.persistent);
            }
          });
        }
      },
      onBeforeEvent({
        event,
        renderDecisions,
        personalization = {},
        onResponse = _index.noop
      }) {
        const {
          decisionContext = {}
        } = personalization;
        onResponse((0, _createOnResponseHandler.default)({
          renderDecisions,
          decisionProvider,
          applyResponse,
          event,
          personalization,
          decisionContext: contextProvider.getContext({
            [_constants.CONTEXT_KEY.TYPE]: _constants.CONTEXT_EVENT_TYPE.EDGE,
            [_constants.CONTEXT_KEY.SOURCE]: _constants.CONTEXT_EVENT_SOURCE.REQUEST,
            ...decisionContext
          })
        }));
      },
      onBeforeRequest({
        request
      }) {
        const payload = request.getPayload().toJSON();
        const {
          events = []
        } = payload;
        if (events.length === 0) {
          return;
        }
        events.forEach(event => eventRegistry.addExperienceEdgeEvent(event));
      }
    },
    commands: {
      evaluateRulesets: {
        run: ({
          renderDecisions,
          personalization = {}
        }) => {
          const {
            decisionContext = {}
          } = personalization;
          return evaluateRulesetsCommand.run({
            renderDecisions,
            decisionContext: {
              [_constants.CONTEXT_KEY.TYPE]: _constants.CONTEXT_EVENT_TYPE.RULES_ENGINE,
              [_constants.CONTEXT_KEY.SOURCE]: _constants.CONTEXT_EVENT_SOURCE.REQUEST,
              ...decisionContext
            },
            applyResponse
          });
        },
        optionsValidator: evaluateRulesetsCommand.optionsValidator
      },
      subscribeRulesetItems: subscribeRulesetItems.command
    }
  };
};
createRulesEngine.namespace = "RulesEngine";
createRulesEngine.configValidators = (0, _index2.objectOf)({
  personalizationStorageEnabled: (0, _index2.boolean)().default(false)
});
var _default = exports.default = createRulesEngine;