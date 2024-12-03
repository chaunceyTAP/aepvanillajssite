"use strict";

exports.getPropositionEventType = exports.getEventType = exports.PropositionEventType = void 0;
var _eventType = require("./eventType.js");
/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const PropositionEventType = exports.PropositionEventType = {
  DISPLAY: "display",
  INTERACT: "interact",
  TRIGGER: "trigger",
  DISMISS: "dismiss",
  SUPPRESS: "suppressDisplay"
};
const eventTypeToPropositionEventTypeMapping = {
  [_eventType.DISPLAY]: PropositionEventType.DISPLAY,
  [_eventType.INTERACT]: PropositionEventType.INTERACT,
  [_eventType.TRIGGER]: PropositionEventType.TRIGGER,
  [_eventType.DISMISS]: PropositionEventType.DISMISS,
  [_eventType.SUPPRESS]: PropositionEventType.SUPPRESS
};
const propositionEventTypeToEventTypeMapping = {
  [PropositionEventType.DISPLAY]: _eventType.DISPLAY,
  [PropositionEventType.INTERACT]: _eventType.INTERACT,
  [PropositionEventType.TRIGGER]: _eventType.TRIGGER,
  [PropositionEventType.DISMISS]: _eventType.DISMISS,
  [PropositionEventType.SUPPRESS]: _eventType.SUPPRESS
};
const getPropositionEventType = eventType => eventTypeToPropositionEventTypeMapping[eventType];
exports.getPropositionEventType = getPropositionEventType;
const getEventType = propositionEventType => propositionEventTypeToEventTypeMapping[propositionEventType];
exports.getEventType = getEventType;