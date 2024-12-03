"use strict";

exports.default = void 0;
var _index = require("../../utils/validation/index.js");
var _createComponent = require("./createComponent.js");
var _index2 = require("./dom-actions/index.js");
var _createCollect = require("../../utils/createCollect.js");
var _index3 = require("./flicker/index.js");
var _createFetchDataHandler = require("./createFetchDataHandler.js");
var _collectClicks = require("./dom-actions/clicks/collectClicks.js");
var _isAuthoringModeEnabled = require("./utils/isAuthoringModeEnabled.js");
var _event = require("../../utils/event.js");
var _createOnClickHandler = require("./createOnClickHandler.js");
var _createViewCacheManager = require("./createViewCacheManager.js");
var _createViewChangeHandler = require("./createViewChangeHandler.js");
var _createClickStorage = require("./createClickStorage.js");
var _createInteractionStorage = require("./createInteractionStorage.js");
var _createApplyPropositions = require("./createApplyPropositions.js");
var _createGetPageLocation = require("./createGetPageLocation.js");
var _createSetTargetMigration = require("./createSetTargetMigration.js");
var _remapCustomCodeOffers = require("./dom-actions/remapCustomCodeOffers.js");
var _remapHeadOffers = require("./dom-actions/remapHeadOffers.js");
var _createPreprocess = require("./dom-actions/createPreprocess.js");
var _injectCreateProposition = require("./handlers/injectCreateProposition.js");
var _createAsyncArray = require("./utils/createAsyncArray.js");
var schema = require("../../constants/schema.js");
var _processDefaultContent = require("./handlers/processDefaultContent.js");
var _surfaceUtils = require("./utils/surfaceUtils.js");
var _createProcessDomAction = require("./handlers/createProcessDomAction.js");
var _createProcessHtmlContent = require("./handlers/createProcessHtmlContent.js");
var _createProcessRedirect = require("./handlers/createProcessRedirect.js");
var _createProcessPropositions = require("./handlers/createProcessPropositions.js");
var _createOnDecisionHandler = require("./createOnDecisionHandler.js");
var _createProcessInAppMessage = require("./handlers/createProcessInAppMessage.js");
var _initInAppMessageActionsModules = require("./in-app-message-actions/initInAppMessageActionsModules.js");
var _createRedirect = require("./dom-actions/createRedirect.js");
var _createNotificationHandler = require("./createNotificationHandler.js");
var _createHandleConsentFlicker = require("./createHandleConsentFlicker.js");
var _collectInteractions = require("./dom-actions/clicks/collectInteractions.js");
var _propositionInteractionType = require("../../constants/propositionInteractionType.js");
var _decisionProvider = require("../../constants/decisionProvider.js");
/*
Copyright 2019 Adobe. Ackll rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const createPersonalization = ({
  config,
  logger,
  eventManager,
  consent
}) => {
  const {
    targetMigrationEnabled,
    prehidingStyle,
    autoCollectPropositionInteractions
  } = config;
  const collect = (0, _createCollect.default)({
    eventManager,
    mergeDecisionsMeta: _event.mergeDecisionsMeta
  });
  const showContainers = (0, _index3.createShowContainers)(logger);
  const hideContainers = (0, _index3.createHideContainers)(logger);
  const {
    storeInteractionMeta,
    getInteractionMetas
  } = (0, _createInteractionStorage.default)();
  const {
    storeClickMeta,
    getClickSelectors,
    getClickMetas
  } = (0, _createClickStorage.default)();
  const getPageLocation = (0, _createGetPageLocation.default)({
    window
  });
  const domActionsModules = (0, _index2.initDomActionsModules)();
  const preprocess = (0, _createPreprocess.default)([_remapHeadOffers.default, _remapCustomCodeOffers.default]);
  const createProposition = (0, _injectCreateProposition.default)({
    preprocess,
    isPageWideSurface: _surfaceUtils.isPageWideSurface
  });
  const viewCache = (0, _createViewCacheManager.default)({
    createProposition
  });
  const executeRedirect = (0, _createRedirect.default)(window);
  const schemaProcessors = {
    [schema.DEFAULT_CONTENT_ITEM]: _processDefaultContent.default,
    [schema.DOM_ACTION]: (0, _createProcessDomAction.default)({
      modules: domActionsModules,
      logger,
      storeInteractionMeta,
      storeClickMeta,
      autoCollectPropositionInteractions
    }),
    [schema.HTML_CONTENT_ITEM]: (0, _createProcessHtmlContent.default)({
      modules: domActionsModules,
      logger,
      storeInteractionMeta,
      autoCollectPropositionInteractions
    }),
    [schema.REDIRECT_ITEM]: (0, _createProcessRedirect.default)({
      logger,
      executeRedirect,
      collect
    }),
    [schema.MESSAGE_IN_APP]: (0, _createProcessInAppMessage.default)({
      modules: (0, _initInAppMessageActionsModules.default)(collect),
      logger
    })
  };
  const processPropositions = (0, _createProcessPropositions.default)({
    schemaProcessors,
    logger
  });
  const renderedPropositions = (0, _createAsyncArray.default)();
  const notificationHandler = (0, _createNotificationHandler.default)(collect, renderedPropositions);
  const fetchDataHandler = (0, _createFetchDataHandler.default)({
    prehidingStyle,
    showContainers,
    hideContainers,
    mergeQuery: _event.mergeQuery,
    processPropositions,
    createProposition,
    notificationHandler,
    consent,
    logger
  });
  const onClickHandler = (0, _createOnClickHandler.default)({
    mergeDecisionsMeta: _event.mergeDecisionsMeta,
    collectInteractions: _collectInteractions.default,
    collectClicks: _collectClicks.default,
    getInteractionMetas,
    getClickMetas,
    getClickSelectors,
    autoCollectPropositionInteractions
  });
  const viewChangeHandler = (0, _createViewChangeHandler.default)({
    processPropositions,
    viewCache,
    logger
  });
  const applyPropositions = (0, _createApplyPropositions.default)({
    processPropositions,
    createProposition,
    renderedPropositions,
    viewCache
  });
  const setTargetMigration = (0, _createSetTargetMigration.default)({
    targetMigrationEnabled
  });
  const onDecisionHandler = (0, _createOnDecisionHandler.default)({
    processPropositions,
    createProposition,
    notificationHandler
  });
  const handleConsentFlicker = (0, _createHandleConsentFlicker.default)({
    showContainers,
    consent
  });
  return (0, _createComponent.default)({
    getPageLocation,
    logger,
    fetchDataHandler,
    viewChangeHandler,
    onClickHandler,
    isAuthoringModeEnabled: _isAuthoringModeEnabled.default,
    mergeQuery: _event.mergeQuery,
    viewCache,
    showContainers,
    applyPropositions,
    setTargetMigration,
    mergeDecisionsMeta: _event.mergeDecisionsMeta,
    renderedPropositions,
    onDecisionHandler,
    handleConsentFlicker
  });
};
createPersonalization.namespace = "Personalization";
const interactionConfigOptions = _propositionInteractionType.PROPOSITION_INTERACTION_TYPES.map(propositionInteractionType => (0, _index.literal)(propositionInteractionType));
createPersonalization.configValidators = (0, _index.objectOf)({
  prehidingStyle: (0, _index.string)().nonEmpty(),
  targetMigrationEnabled: (0, _index.boolean)().default(false),
  autoCollectPropositionInteractions: (0, _index.objectOf)({
    [_decisionProvider.ADOBE_JOURNEY_OPTIMIZER]: (0, _index.anyOf)(interactionConfigOptions).default(_propositionInteractionType.ALWAYS),
    [_decisionProvider.ADOBE_TARGET]: (0, _index.anyOf)(interactionConfigOptions).default(_propositionInteractionType.NEVER)
  }).default({
    [_decisionProvider.ADOBE_JOURNEY_OPTIMIZER]: _propositionInteractionType.ALWAYS,
    [_decisionProvider.ADOBE_TARGET]: _propositionInteractionType.NEVER
  }).noUnknownFields()
});
var _default = exports.default = createPersonalization;