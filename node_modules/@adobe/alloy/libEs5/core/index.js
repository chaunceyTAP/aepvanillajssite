"use strict";

exports.default = exports.createExecuteCommand = void 0;
var _createInstanceFunction = require("./createInstanceFunction.js");
var _index = require("../utils/index.js");
var _createLogController = require("./createLogController.js");
var _createLifecycle = require("./createLifecycle.js");
var _createComponentRegistry = require("./createComponentRegistry.js");
var _injectSendNetworkRequest = require("./network/injectSendNetworkRequest.js");
var _injectExtractEdgeInfo = require("./edgeNetwork/injectExtractEdgeInfo.js");
var _createConsent = require("./consent/createConsent.js");
var _createConsentStateMachine = require("./consent/createConsentStateMachine.js");
var _createEvent = require("./createEvent.js");
var _injectCreateResponse = require("./injectCreateResponse.js");
var _injectExecuteCommand = require("./injectExecuteCommand.js");
var _validateCommandOptions = require("./validateCommandOptions.js");
var _buildAndValidateConfig = require("./buildAndValidateConfig.js");
var _initializeComponents = require("./initializeComponents.js");
var _createConfig = require("./config/createConfig.js");
var _createCoreConfigs = require("./config/createCoreConfigs.js");
var _injectHandleError = require("./injectHandleError.js");
var _injectSendFetchRequest = require("./network/requestMethods/injectSendFetchRequest.js");
var _injectSendBeaconRequest = require("./network/requestMethods/injectSendBeaconRequest.js");
var _createLogger = require("./createLogger.js");
var _createEventManager = require("./createEventManager.js");
var _createCookieTransfer = require("./createCookieTransfer.js");
var _injectShouldTransferCookie = require("./injectShouldTransferCookie.js");
var _index2 = require("../utils/request/index.js");
var _injectSendEdgeNetworkRequest = require("./edgeNetwork/injectSendEdgeNetworkRequest.js");
var _injectProcessWarningsAndErrors = require("./edgeNetwork/injectProcessWarningsAndErrors.js");
var _injectGetLocationHint = require("./edgeNetwork/injectGetLocationHint.js");
var _isRequestRetryable = require("./network/isRequestRetryable.js");
var _getRequestRetryDelay = require("./network/getRequestRetryDelay.js");
var _injectApplyResponse = require("./edgeNetwork/injectApplyResponse.js");
var requiredComponents = require("./requiredComponentCreators.js");
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

const createNamespacedStorage = (0, _index.injectStorage)(window);
const {
  console,
  fetch,
  navigator
} = window;

// set this up as a function so that monitors can be added at anytime
// eslint-disable-next-line no-underscore-dangle
const getMonitors = () => window.__alloyMonitors || [];
const coreConfigValidators = (0, _createCoreConfigs.default)();
const apexDomain = (0, _index.getApexDomain)(window, _index.cookieJar);
const sendFetchRequest = (0, _injectSendFetchRequest.default)({
  fetch
});
const fireReferrerHideableImage = (0, _index.injectFireReferrerHideableImage)();
const getAssuranceValidationTokenParams = (0, _index2.createGetAssuranceValidationTokenParams)({
  window,
  createNamespacedStorage
});
const getBrowser = (0, _index.injectGetBrowser)({
  userAgent: window.navigator.userAgent
});
const createExecuteCommand = ({
  instanceName,
  logController: {
    setDebugEnabled,
    logger,
    createComponentLogger
  },
  components
}) => {
  const componentRegistry = (0, _createComponentRegistry.default)();
  const lifecycle = (0, _createLifecycle.default)(componentRegistry);
  const componentCreators = components.concat(Object.values(requiredComponents));
  const setDebugCommand = options => {
    setDebugEnabled(options.enabled, {
      fromConfig: false
    });
  };
  const loggingCookieJar = (0, _index.createLoggingCookieJar)({
    logger,
    cookieJar: _index.cookieJar
  });
  const configureCommand = options => {
    const config = (0, _buildAndValidateConfig.default)({
      options,
      componentCreators,
      coreConfigValidators,
      createConfig: _createConfig.default,
      logger,
      setDebugEnabled
    });
    const {
      orgId,
      targetMigrationEnabled
    } = config;
    const shouldTransferCookie = (0, _injectShouldTransferCookie.default)({
      orgId,
      targetMigrationEnabled
    });
    const cookieTransfer = (0, _createCookieTransfer.default)({
      cookieJar: loggingCookieJar,
      shouldTransferCookie,
      apexDomain,
      dateProvider: () => new Date()
    });
    const sendBeaconRequest = (0, _index.isFunction)(navigator.sendBeacon) ? (0, _injectSendBeaconRequest.default)({
      // Without the bind(), the browser will complain about an
      // illegal invocation.
      sendBeacon: navigator.sendBeacon.bind(navigator),
      sendFetchRequest,
      logger
    }) : sendFetchRequest;
    const sendNetworkRequest = (0, _injectSendNetworkRequest.default)({
      logger,
      sendFetchRequest,
      sendBeaconRequest,
      isRequestRetryable: _isRequestRetryable.default,
      getRequestRetryDelay: _getRequestRetryDelay.default
    });
    const processWarningsAndErrors = (0, _injectProcessWarningsAndErrors.default)({
      logger
    });
    const extractEdgeInfo = (0, _injectExtractEdgeInfo.default)({
      logger
    });
    const createResponse = (0, _injectCreateResponse.default)({
      extractEdgeInfo
    });
    const getLocationHint = (0, _injectGetLocationHint.default)({
      orgId,
      cookieJar: _index.cookieJar
    });
    const sendEdgeNetworkRequest = (0, _injectSendEdgeNetworkRequest.default)({
      config,
      lifecycle,
      cookieTransfer,
      sendNetworkRequest,
      createResponse,
      processWarningsAndErrors,
      getLocationHint,
      getAssuranceValidationTokenParams
    });
    const applyResponse = (0, _injectApplyResponse.default)({
      lifecycle,
      cookieTransfer,
      createResponse,
      processWarningsAndErrors
    });
    const generalConsentState = (0, _createConsentStateMachine.default)({
      logger
    });
    const consent = (0, _createConsent.default)({
      generalConsentState,
      logger
    });
    const eventManager = (0, _createEventManager.default)({
      config,
      logger,
      lifecycle,
      consent,
      createEvent: _createEvent.default,
      createDataCollectionRequestPayload: _index2.createDataCollectionRequestPayload,
      createDataCollectionRequest: _index2.createDataCollectionRequest,
      sendEdgeNetworkRequest,
      applyResponse
    });
    return (0, _initializeComponents.default)({
      componentCreators,
      lifecycle,
      componentRegistry,
      getImmediatelyAvailableTools(componentName) {
        const componentLogger = createComponentLogger(componentName);
        return {
          config,
          componentRegistry,
          consent,
          eventManager,
          fireReferrerHideableImage,
          logger: componentLogger,
          lifecycle,
          sendEdgeNetworkRequest,
          handleError: (0, _injectHandleError.default)({
            errorPrefix: "[" + instanceName + "] [" + componentName + "]",
            logger: componentLogger
          }),
          createNamespacedStorage,
          apexDomain,
          getBrowser
        };
      }
    });
  };
  const handleError = (0, _injectHandleError.default)({
    errorPrefix: "[" + instanceName + "]",
    logger
  });
  const executeCommand = (0, _injectExecuteCommand.default)({
    logger,
    configureCommand,
    setDebugCommand,
    handleError,
    validateCommandOptions: _validateCommandOptions.default
  });
  return executeCommand;
};
exports.createExecuteCommand = createExecuteCommand;
var _default = ({
  components
}) => {
  // eslint-disable-next-line no-underscore-dangle
  const instanceNames = window.__alloyNS;
  if (instanceNames) {
    instanceNames.forEach(instanceName => {
      const logController = (0, _createLogController.default)({
        console,
        locationSearch: window.location.search,
        createLogger: _createLogger.default,
        instanceName,
        createNamespacedStorage,
        getMonitors
      });
      const executeCommand = createExecuteCommand({
        instanceName,
        logController,
        components
      });
      const instance = (0, _createInstanceFunction.default)(executeCommand);
      const queue = window[instanceName].q;
      queue.push = instance;
      logController.logger.logOnInstanceCreated({
        instance
      });
      queue.forEach(instance);
    });
  }
};
exports.default = _default;