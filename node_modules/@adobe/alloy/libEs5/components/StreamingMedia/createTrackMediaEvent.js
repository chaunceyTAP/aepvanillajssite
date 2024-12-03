"use strict";

exports.default = void 0;
var _eventTypes = require("./constants/eventTypes.js");
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

const getContentState = (eventType, sessionContentState) => {
  if (eventType === _eventTypes.default.AD_START || eventType === _eventTypes.default.Ad_BREAK_START || eventType === _eventTypes.default.AD_SKIP || eventType === _eventTypes.default.AD_COMPLETE) {
    return "ad";
  }
  if (eventType === _eventTypes.default.AD_BREAK_COMPLETE || eventType === _eventTypes.default.CHAPTER_COMPLETE || eventType === _eventTypes.default.CHAPTER_START || eventType === _eventTypes.default.CHAPTER_SKIP || eventType === _eventTypes.default.SESSION_START) {
    return "main";
  }
  if (eventType === _eventTypes.default.SESSION_END || eventType === _eventTypes.default.SESSION_COMPLETE) {
    return "completed";
  }
  return sessionContentState;
};
var _default = ({
  mediaEventManager,
  mediaSessionCacheManager,
  config
}) => {
  const sendMediaEvent = options => {
    const event = mediaEventManager.createMediaEvent({
      options
    });
    const {
      playerId,
      xdm
    } = options;
    const {
      eventType
    } = xdm;
    const action = eventType.split(".")[1];
    const {
      getPlayerDetails,
      sessionPromise,
      playbackState
    } = mediaSessionCacheManager.getSession(playerId);
    return sessionPromise.then(result => {
      if (!result.sessionId) {
        return Promise.reject(new Error("Failed to trigger media event: " + eventType + ". Session ID is not available for playerId: " + playerId + "."));
      }
      mediaEventManager.augmentMediaEvent({
        event,
        eventType,
        playerId,
        getPlayerDetails,
        sessionID: result.sessionId
      });
      return mediaEventManager.trackMediaEvent({
        event,
        action
      }).then(() => {
        if (playerId) {
          if (eventType === _eventTypes.default.SESSION_COMPLETE || eventType === _eventTypes.default.SESSION_END) {
            mediaSessionCacheManager.stopPing({
              playerId
            });
          } else {
            const sessionPlaybackState = getContentState(eventType, playbackState);
            if (sessionPlaybackState === "completed") {
              return;
            }
            const interval = sessionPlaybackState === "ad" ? config.streamingMedia.adPingInterval : config.streamingMedia.mainPingInterval;
            const pingId = setTimeout(() => {
              const pingOptions = {
                playerId,
                xdm: {
                  eventType: _eventTypes.default.PING
                }
              };
              sendMediaEvent(pingOptions);
            }, interval * 1000);
            mediaSessionCacheManager.savePing({
              playerId,
              pingId,
              playbackState: sessionPlaybackState
            });
          }
        }
      });
    });
  };
  return options => sendMediaEvent(options);
};
exports.default = _default;