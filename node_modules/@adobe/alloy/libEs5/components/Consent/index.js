"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _createComponent = require("./createComponent.js");
var _createConsentHashStore = require("./createConsentHashStore.js");
var _createConsentRequestPayload = require("./createConsentRequestPayload.js");
var _createConsentRequest = require("./createConsentRequest.js");
var _createStoredConsent = require("./createStoredConsent.js");
var _injectSendSetConsentRequest = require("./injectSendSetConsentRequest.js");
var _parseConsentCookie = require("./parseConsentCookie.js");
var _validateSetConsentOptions = require("./validateSetConsentOptions.js");
var _configValidators = require("./configValidators.js");
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

const createConsent = ({
  config,
  consent,
  sendEdgeNetworkRequest,
  createNamespacedStorage
}) => {
  const {
    orgId,
    defaultConsent
  } = config;
  const storedConsent = (0, _createStoredConsent.default)({
    parseConsentCookie: _parseConsentCookie.default,
    orgId,
    cookieJar: _index.cookieJar
  });
  const taskQueue = (0, _index.createTaskQueue)();
  const sendSetConsentRequest = (0, _injectSendSetConsentRequest.default)({
    createConsentRequestPayload: _createConsentRequestPayload.default,
    createConsentRequest: _createConsentRequest.default,
    sendEdgeNetworkRequest,
    edgeConfigOverrides: config.edgeConfigOverrides
  });
  const storage = createNamespacedStorage((0, _index.sanitizeOrgIdForCookieName)(orgId) + ".consentHashes.");
  const consentHashStore = (0, _createConsentHashStore.default)({
    storage: storage.persistent
  });
  const doesIdentityCookieExist = (0, _index.injectDoesIdentityCookieExist)({
    orgId
  });
  return (0, _createComponent.default)({
    storedConsent,
    taskQueue,
    defaultConsent,
    consent,
    sendSetConsentRequest,
    validateSetConsentOptions: _validateSetConsentOptions.default,
    consentHashStore,
    doesIdentityCookieExist
  });
};
createConsent.namespace = "Consent";
createConsent.configValidators = _configValidators.default;
var _default = exports.default = createConsent;