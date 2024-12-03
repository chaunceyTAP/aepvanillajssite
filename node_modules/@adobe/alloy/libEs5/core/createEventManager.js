"use strict";

exports.default = void 0;
var _pageWideScope = require("../constants/pageWideScope.js");
var _index = require("../utils/index.js");
var _index2 = require("../utils/request/index.js");
/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const EVENT_CANCELLATION_MESSAGE = "Event was canceled because the onBeforeEventSend callback returned false.";
var _default = ({
  config,
  logger,
  lifecycle,
  consent,
  createEvent,
  createDataCollectionRequestPayload,
  createDataCollectionRequest,
  sendEdgeNetworkRequest,
  applyResponse
}) => {
  const {
    onBeforeEventSend,
    edgeConfigOverrides: globalConfigOverrides
  } = config;
  return {
    createEvent,
    /**
     * Sends an event. This includes running the event and payload through the
     * appropriate lifecycle hooks, sending the request to the server, and
     * handling the response.
     * @param {Object} event This will be JSON stringified and used inside the
     * request payload.
     * @param {Object} [options] Options to pass on to the onBeforeEvent
     * lifecycle method
     * @param {Object} [options.edgeConfigOverrides] Settings that take
     * precedence over the global datastream configuration, including which
     * datastream to use.
     * @returns {*}
     */
    sendEvent(event, options = {}) {
      const {
        edgeConfigOverrides: localConfigOverrides,
        ...otherOptions
      } = options;
      const requestParams = (0, _index2.createRequestParams)({
        payload: createDataCollectionRequestPayload(),
        localConfigOverrides,
        globalConfigOverrides
      });
      const request = createDataCollectionRequest(requestParams);
      const onResponseCallbackAggregator = (0, _index.createCallbackAggregator)();
      const onRequestFailureCallbackAggregator = (0, _index.createCallbackAggregator)();
      return lifecycle.onBeforeEvent({
        ...otherOptions,
        event,
        onResponse: onResponseCallbackAggregator.add,
        onRequestFailure: onRequestFailureCallbackAggregator.add
      }).then(() => {
        requestParams.payload.addEvent(event);
        return consent.awaitConsent();
      }).then(() => {
        try {
          // NOTE: this calls onBeforeEventSend callback (if configured)
          event.finalize(onBeforeEventSend);
        } catch (error) {
          const throwError = () => {
            throw error;
          };
          onRequestFailureCallbackAggregator.add(lifecycle.onRequestFailure);
          return onRequestFailureCallbackAggregator.call({
            error
          }).then(throwError, throwError);
        }

        // if the callback returns false, the event should not be sent
        if (!event.shouldSend()) {
          onRequestFailureCallbackAggregator.add(lifecycle.onRequestFailure);
          logger.info(EVENT_CANCELLATION_MESSAGE);
          const error = new Error(EVENT_CANCELLATION_MESSAGE);
          return onRequestFailureCallbackAggregator.call({
            error
          }).then(() => {
            // Ensure the promise gets resolved with undefined instead
            // of an array of return values from the callbacks.
          });
        }
        return sendEdgeNetworkRequest({
          request,
          runOnResponseCallbacks: onResponseCallbackAggregator.call,
          runOnRequestFailureCallbacks: onRequestFailureCallbackAggregator.call
        });
      });
    },
    applyResponse(event, options = {}) {
      const {
        renderDecisions = false,
        decisionContext = {},
        responseHeaders = {},
        responseBody = {
          handle: []
        },
        personalization
      } = options;
      const payload = createDataCollectionRequestPayload();
      const request = createDataCollectionRequest({
        payload
      });
      const onResponseCallbackAggregator = (0, _index.createCallbackAggregator)();
      return lifecycle.onBeforeEvent({
        event,
        renderDecisions,
        decisionContext,
        decisionScopes: [_pageWideScope.default],
        personalization,
        onResponse: onResponseCallbackAggregator.add,
        onRequestFailure: _index.noop
      }).then(() => {
        payload.addEvent(event);
        return applyResponse({
          request,
          responseHeaders,
          responseBody,
          runOnResponseCallbacks: onResponseCallbackAggregator.call
        });
      });
    }
  };
};
exports.default = _default;