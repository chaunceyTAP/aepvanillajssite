"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _constants = require("./constants/constants.js");
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
  trackMediaEvent,
  trackMediaSession,
  mediaResponseHandler,
  logger,
  createMediaHelper,
  createGetInstance,
  config
}) => {
  return {
    lifecycle: {
      onBeforeEvent({
        mediaOptions,
        onResponse = _index.noop
      }) {
        if (!mediaOptions) {
          return;
        }
        const {
          legacy,
          playerId,
          getPlayerDetails
        } = mediaOptions;
        if (!legacy) {
          return;
        }
        onResponse(({
          response
        }) => {
          return mediaResponseHandler({
            playerId,
            getPlayerDetails,
            response
          });
        });
      }
    },
    commands: {
      getMediaAnalyticsTracker: {
        run: () => {
          if (!config.streamingMedia) {
            return Promise.reject(new Error("Streaming media is not configured."));
          }
          logger.info("Streaming media is configured in legacy mode.");
          const mediaAnalyticsHelper = createMediaHelper({
            logger
          });
          return Promise.resolve({
            getInstance: () => {
              return createGetInstance({
                logger,
                trackMediaEvent,
                trackMediaSession,
                uuid: _index.uuid
              });
            },
            Event: _constants.EVENT,
            MediaType: _constants.MEDIA_TYPE,
            PlayerState: _constants.PLAYER_STATE,
            StreamType: _constants.STREAM_TYPE,
            MediaObjectKey: _constants.MEDIA_OBJECT_KEYS,
            VideoMetadataKeys: _constants.VIDEO_METADATA_KEYS,
            AudioMetadataKeys: _constants.AUDIO_METADATA_KEYS,
            AdMetadataKeys: _constants.AD_METADATA_KEYS,
            ...mediaAnalyticsHelper
          });
        }
      }
    }
  };
};
exports.default = _default;