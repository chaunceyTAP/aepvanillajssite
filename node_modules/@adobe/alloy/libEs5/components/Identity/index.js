"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _injectProcessIdSyncs = require("./injectProcessIdSyncs.js");
var _configValidators = require("./configValidators.js");
var _createComponent = require("./createComponent.js");
var _createLegacyIdentity = require("./createLegacyIdentity.js");
var _awaitVisitorOptIn = require("./visitorService/awaitVisitorOptIn.js");
var _injectGetEcidFromVisitor = require("./visitorService/injectGetEcidFromVisitor.js");
var _injectHandleResponseForIdSyncs = require("./injectHandleResponseForIdSyncs.js");
var _injectEnsureSingleIdentity = require("./injectEnsureSingleIdentity.js");
var _injectAddEcidQueryToPayload = require("./injectAddEcidQueryToPayload.js");
var _injectSetDomainForInitialIdentityPayload = require("./injectSetDomainForInitialIdentityPayload.js");
var _injectAddLegacyEcidToPayload = require("./injectAddLegacyEcidToPayload.js");
var _injectAddQueryStringIdentityToPayload = require("./injectAddQueryStringIdentityToPayload.js");
var _addEcidToPayload = require("./addEcidToPayload.js");
var _injectAwaitIdentityCookie = require("./injectAwaitIdentityCookie.js");
var _getNamespacesFromResponse = require("./getNamespacesFromResponse.js");
var _createGetIdentity = require("./getIdentity/createGetIdentity.js");
var _createIdentityRequest = require("./getIdentity/createIdentityRequest.js");
var _createIdentityRequestPayload = require("./getIdentity/createIdentityRequestPayload.js");
var _injectAppendIdentityToUrl = require("./appendIdentityToUrl/injectAppendIdentityToUrl.js");
var _createGetIdentityOptionsValidator = require("./getIdentity/createGetIdentityOptionsValidator.js");
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

const createIdentity = ({
  config,
  logger,
  consent,
  fireReferrerHideableImage,
  sendEdgeNetworkRequest,
  apexDomain,
  getBrowser
}) => {
  const {
    orgId,
    thirdPartyCookiesEnabled,
    edgeConfigOverrides: globalConfigOverrides
  } = config;
  const getEcidFromVisitor = (0, _injectGetEcidFromVisitor.default)({
    logger,
    orgId,
    awaitVisitorOptIn: _awaitVisitorOptIn.default
  });
  const loggingCookieJar = (0, _index.createLoggingCookieJar)({
    logger,
    cookieJar: _index.cookieJar
  });
  const legacyIdentity = (0, _createLegacyIdentity.default)({
    config,
    getEcidFromVisitor,
    apexDomain,
    cookieJar: loggingCookieJar,
    isPageSsl: window.location.protocol === "https:"
  });
  const doesIdentityCookieExist = (0, _index.injectDoesIdentityCookieExist)({
    orgId
  });
  const getIdentity = (0, _createGetIdentity.default)({
    sendEdgeNetworkRequest,
    createIdentityRequestPayload: _createIdentityRequestPayload.default,
    createIdentityRequest: _createIdentityRequest.default,
    globalConfigOverrides
  });
  const areThirdPartyCookiesSupportedByDefault = (0, _index.injectAreThirdPartyCookiesSupportedByDefault)({
    getBrowser
  });
  const setDomainForInitialIdentityPayload = (0, _injectSetDomainForInitialIdentityPayload.default)({
    thirdPartyCookiesEnabled,
    areThirdPartyCookiesSupportedByDefault
  });
  const addLegacyEcidToPayload = (0, _injectAddLegacyEcidToPayload.default)({
    getLegacyEcid: legacyIdentity.getEcid,
    addEcidToPayload: _addEcidToPayload.default
  });
  const addQueryStringIdentityToPayload = (0, _injectAddQueryStringIdentityToPayload.default)({
    locationSearch: window.document.location.search,
    dateProvider: () => new Date(),
    orgId,
    logger
  });
  const awaitIdentityCookie = (0, _injectAwaitIdentityCookie.default)({
    doesIdentityCookieExist,
    orgId,
    logger
  });
  const ensureSingleIdentity = (0, _injectEnsureSingleIdentity.default)({
    doesIdentityCookieExist,
    setDomainForInitialIdentityPayload,
    addLegacyEcidToPayload,
    awaitIdentityCookie,
    logger
  });
  const processIdSyncs = (0, _injectProcessIdSyncs.default)({
    fireReferrerHideableImage,
    logger
  });
  const handleResponseForIdSyncs = (0, _injectHandleResponseForIdSyncs.default)({
    processIdSyncs
  });
  const appendIdentityToUrl = (0, _injectAppendIdentityToUrl.default)({
    dateProvider: () => new Date(),
    orgId,
    globalConfigOverrides
  });
  const getIdentityOptionsValidator = (0, _createGetIdentityOptionsValidator.default)({
    thirdPartyCookiesEnabled
  });
  const addEcidQueryToPayload = (0, _injectAddEcidQueryToPayload.default)({
    thirdPartyCookiesEnabled,
    areThirdPartyCookiesSupportedByDefault
  });
  return (0, _createComponent.default)({
    addEcidQueryToPayload,
    addQueryStringIdentityToPayload,
    ensureSingleIdentity,
    setLegacyEcid: legacyIdentity.setEcid,
    handleResponseForIdSyncs,
    getNamespacesFromResponse: _getNamespacesFromResponse.default,
    getIdentity,
    consent,
    appendIdentityToUrl,
    logger,
    config,
    getIdentityOptionsValidator
  });
};
createIdentity.namespace = "Identity";
createIdentity.configValidators = _configValidators.default;
var _default = exports.default = createIdentity;