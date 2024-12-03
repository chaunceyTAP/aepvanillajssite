"use strict";

exports.default = void 0;
var _eventTypes = require("./constants/eventTypes.js");
var _createMediaRequest = require("./createMediaRequest.js");
var _index = require("../../utils/index.js");
var _index2 = require("../../utils/request/index.js");
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
  config,
  eventManager,
  consent,
  sendEdgeNetworkRequest,
  setTimestamp
}) => {
  return {
    createMediaEvent({
      options
    }) {
      const event = eventManager.createEvent();
      const {
        xdm
      } = options;
      setTimestamp(xdm);
      event.setUserXdm(xdm);
      if (xdm.eventType === _eventTypes.default.AD_START) {
        const {
          advertisingDetails
        } = options.xdm.mediaCollection;
        event.mergeXdm({
          mediaCollection: {
            advertisingDetails: {
              playerName: advertisingDetails.playerName || config.streamingMedia.playerName
            }
          }
        });
      }
      return event;
    },
    createMediaSession(options) {
      const {
        playerName,
        channel,
        appVersion
      } = config.streamingMedia;
      const event = eventManager.createEvent();
      const {
        sessionDetails
      } = options.xdm.mediaCollection;
      event.setUserXdm(options.xdm);
      event.mergeXdm({
        eventType: _eventTypes.default.SESSION_START,
        mediaCollection: {
          sessionDetails: {
            playerName: sessionDetails.playerName || playerName,
            channel: sessionDetails.channel || channel,
            appVersion: sessionDetails.appVersion || appVersion
          }
        }
      });
      return event;
    },
    augmentMediaEvent({
      event,
      playerId,
      getPlayerDetails,
      sessionID
    }) {
      if (!playerId || !getPlayerDetails) {
        return event;
      }
      const {
        playhead,
        qoeDataDetails
      } = getPlayerDetails({
        playerId
      });
      event.mergeXdm({
        mediaCollection: {
          playhead: (0, _index.toInteger)(playhead),
          qoeDataDetails,
          sessionID
        }
      });
      return event;
    },
    trackMediaSession({
      event,
      mediaOptions,
      edgeConfigOverrides
    }) {
      const sendEventOptions = {
        mediaOptions,
        edgeConfigOverrides
      };
      return eventManager.sendEvent(event, sendEventOptions);
    },
    trackMediaEvent({
      event,
      action
    }) {
      const mediaRequestPayload = (0, _index2.createDataCollectionRequestPayload)();
      const request = (0, _createMediaRequest.default)({
        mediaRequestPayload,
        action
      });
      mediaRequestPayload.addEvent(event);
      event.finalize();
      return consent.awaitConsent().then(() => {
        return sendEdgeNetworkRequest({
          request
        }).then(() => {
          return {};
        });
      });
    }
  };
};
exports.default = _default;