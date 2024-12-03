"use strict";

exports.default = void 0;
var _isBlankString = require("../../utils/isBlankString.js");
var _eventTypes = require("./constants/eventTypes.js");
var _index = require("../../utils/index.js");
var _playbackState = require("./constants/playbackState.js");
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
var _default = ({
  mediaSessionCacheManager,
  config,
  trackMediaEvent
}) => {
  return ({
    response,
    playerId,
    getPlayerDetails
  }) => {
    const mediaPayload = response.getPayloadsByType("media-analytics:new-session");
    if ((0, _index.isNonEmptyArray)(mediaPayload)) {
      const {
        sessionId
      } = mediaPayload[0];
      if ((0, _isBlankString.default)(sessionId)) {
        return {};
      }
      if (!playerId || !getPlayerDetails) {
        return {
          sessionId
        };
      }
      const pingId = setTimeout(() => {
        trackMediaEvent({
          playerId,
          xdm: {
            eventType: _eventTypes.default.PING
          }
        });
      }, config.streamingMedia.mainPingInterval * 1000);
      mediaSessionCacheManager.savePing({
        playerId,
        pingId,
        playbackState: _playbackState.default.MAIN
      });
      return {
        sessionId
      };
    }
    return {};
  };
};
exports.default = _default;