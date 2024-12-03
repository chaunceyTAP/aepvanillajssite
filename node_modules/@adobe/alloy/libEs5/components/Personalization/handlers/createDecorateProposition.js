"use strict";

exports.default = exports.INTERACT_ID_DATA_ATTRIBUTE = exports.CLICK_TOKEN_DATA_ATTRIBUTE = exports.CLICK_LABEL_DATA_ATTRIBUTE = void 0;
var _index = require("../dom-actions/dom/index.js");
var _index2 = require("../../../utils/index.js");
var _initDomActionsModules = require("../dom-actions/initDomActionsModules.js");
var _propositionInteractionType = require("../../../constants/propositionInteractionType.js");
/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const INTERACT_ID_DATA_ATTRIBUTE = exports.INTERACT_ID_DATA_ATTRIBUTE = "data-aep-interact-id";
const CLICK_LABEL_DATA_ATTRIBUTE = exports.CLICK_LABEL_DATA_ATTRIBUTE = "data-aep-click-label";
const CLICK_TOKEN_DATA_ATTRIBUTE = exports.CLICK_TOKEN_DATA_ATTRIBUTE = "data-aep-click-token";
let lastInteractId = 0;
const getInteractId = (propositionId, existingInteractId) => {
  if (existingInteractId) {
    return parseInt(existingInteractId, 10);
  }

  // eslint-disable-next-line no-plusplus
  return ++lastInteractId;
};
const interactionTrackingSupported = (autoCollectPropositionInteractions, decisionProvider) => {
  if (!autoCollectPropositionInteractions) {
    return false;
  }
  if (!autoCollectPropositionInteractions[decisionProvider]) {
    return false;
  }
  return [_propositionInteractionType.ALWAYS, _propositionInteractionType.DECORATED_ELEMENTS_ONLY].includes(autoCollectPropositionInteractions[decisionProvider]);
};
const createDecorateProposition = (autoCollectPropositionInteractions, type, propositionId, itemId, trackingLabel, scopeType, notification, storeInteractionMeta) => {
  const {
    scopeDetails = {}
  } = notification;
  const {
    decisionProvider
  } = scopeDetails;
  if (!interactionTrackingSupported(autoCollectPropositionInteractions, decisionProvider) && type !== _initDomActionsModules.DOM_ACTION_CLICK) {
    return _index2.noop;
  }
  return element => {
    if (!element.tagName) {
      return;
    }
    const interactId = getInteractId(propositionId, (0, _index.getAttribute)(element, INTERACT_ID_DATA_ATTRIBUTE));
    storeInteractionMeta(propositionId, itemId, scopeType, notification, interactId);
    (0, _index.setAttribute)(element, INTERACT_ID_DATA_ATTRIBUTE, interactId);
    if (trackingLabel && !(0, _index.getAttribute)(element, CLICK_LABEL_DATA_ATTRIBUTE)) {
      (0, _index.setAttribute)(element, CLICK_LABEL_DATA_ATTRIBUTE, trackingLabel);
    }
  };
};
var _default = exports.default = createDecorateProposition;