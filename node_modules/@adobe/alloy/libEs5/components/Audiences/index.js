"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _injectProcessDestinations = require("./injectProcessDestinations.js");
var _injectProcessResponse = require("./injectProcessResponse.js");
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

const createAudiences = ({
  logger,
  fireReferrerHideableImage
}) => {
  // we override the js-cookie converter to encode the cookie value similar on how it is in DIL (PDCL-10238)
  const cookieJarWithEncoding = _index.cookieJar.withConverter({
    write: value => {
      return encodeURIComponent(value);
    }
  });
  const loggingCookieJar = (0, _index.createLoggingCookieJar)({
    logger,
    cookieJar: cookieJarWithEncoding
  });
  const processDestinations = (0, _injectProcessDestinations.default)({
    fireReferrerHideableImage,
    logger,
    cookieJar: loggingCookieJar,
    isPageSsl: window.location.protocol === "https:"
  });
  const processResponse = (0, _injectProcessResponse.default)({
    processDestinations
  });
  return {
    lifecycle: {
      onResponse: processResponse
    },
    commands: {}
  };
};
createAudiences.namespace = "Audiences";
var _default = exports.default = createAudiences;