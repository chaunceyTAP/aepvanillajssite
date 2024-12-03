"use strict";

exports.default = void 0;
var _createMediaEventManager = require("../StreamingMedia/createMediaEventManager.js");
var _createMediaSessionCacheManager = require("../StreamingMedia/createMediaSessionCacheManager.js");
var _createTrackMediaEvent = require("../StreamingMedia/createTrackMediaEvent.js");
var _createTrackMediaSession = require("../StreamingMedia/createTrackMediaSession.js");
var _createMediaResponseHandler = require("../StreamingMedia/createMediaResponseHandler.js");
var _createMediaAnalyticsBridgeComponent = require("./createMediaAnalyticsBridgeComponent.js");
var _createMediaHelper = require("./createMediaHelper.js");
var _createGetInstance = require("./createGetInstance.js");
var _injectTimestamp = require("../Context/injectTimestamp.js");
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
/* eslint-disable import/no-restricted-paths */

const createMediaAnalyticsBridge = ({
  eventManager,
  sendEdgeNetworkRequest,
  config,
  logger,
  consent
}) => {
  const mediaSessionCacheManager = (0, _createMediaSessionCacheManager.default)({
    config
  });
  const mediaEventManager = (0, _createMediaEventManager.default)({
    sendEdgeNetworkRequest,
    config,
    consent,
    eventManager,
    setTimestamp: (0, _injectTimestamp.default)(() => new Date())
  });
  const trackMediaEvent = (0, _createTrackMediaEvent.default)({
    mediaSessionCacheManager,
    mediaEventManager,
    config
  });
  const trackMediaSession = (0, _createTrackMediaSession.default)({
    config,
    mediaEventManager,
    mediaSessionCacheManager,
    legacy: true
  });
  const mediaResponseHandler = (0, _createMediaResponseHandler.default)({
    mediaSessionCacheManager,
    config,
    trackMediaEvent
  });
  return (0, _createMediaAnalyticsBridgeComponent.default)({
    mediaResponseHandler,
    trackMediaSession,
    trackMediaEvent,
    createMediaHelper: _createMediaHelper.default,
    createGetInstance: _createGetInstance.default,
    logger,
    config
  });
};
createMediaAnalyticsBridge.namespace = "Legacy Media Analytics";
var _default = exports.default = createMediaAnalyticsBridge;