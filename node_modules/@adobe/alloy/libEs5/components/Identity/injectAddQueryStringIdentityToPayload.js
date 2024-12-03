"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _queryStringIdentityParam = require("../../constants/queryStringIdentityParam.js");
var _ecidNamespace = require("../../constants/ecidNamespace.js");
var _decodeUriComponentSafely = require("../../utils/decodeUriComponentSafely.js");
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
// Example: adobe_mc=TS%3D1641432103%7CMCMID%3D77094828402023918047117570965393734545%7CMCORGID%3DFAF554945B90342F0A495E2C%40AdobeOrg
// Decoded: adobe_mc=TS=1641432103|MCMID=77094828402023918047117570965393734545|MCORGID=FAF554945B90342F0A495E2C@AdobeOrg

const LINK_TTL_SECONDS = 300; // 5 minute link time to live
var _default = ({
  locationSearch,
  dateProvider,
  orgId,
  logger
}) => payload => {
  if (payload.hasIdentity(_ecidNamespace.default)) {
    // don't overwrite a user provided ecid identity
    return;
  }
  const parsedQueryString = _index.queryString.parse(locationSearch);
  let queryStringValue = parsedQueryString[_queryStringIdentityParam.default];
  if (queryStringValue === undefined) {
    return;
  }
  if (Array.isArray(queryStringValue)) {
    logger.warn("Found multiple adobe_mc query string paramters, only using the last one.");
    queryStringValue = queryStringValue[queryStringValue.length - 1];
  }
  const properties = queryStringValue.split("|").reduce((memo, keyValue) => {
    const [key, value] = keyValue.split("=");
    memo[key] = value;
    return memo;
  }, {});
  // We are using MCMID and MCORGID to be compatible with Visitor.
  const ts = parseInt(properties.TS, 10);
  const mcmid = properties.MCMID;
  const mcorgid = (0, _decodeUriComponentSafely.default)(properties.MCORGID);
  if (
  // When TS is not specified or not a number, the following inequality returns false.
  // All inequalities with NaN variables are false.
  dateProvider().getTime() / 1000 <= ts + LINK_TTL_SECONDS && mcorgid === orgId && mcmid) {
    logger.info("Found valid ECID identity " + mcmid + " from the adobe_mc query string parameter.");
    payload.addIdentity(_ecidNamespace.default, {
      id: mcmid
    });
  } else {
    logger.info("Detected invalid or expired adobe_mc query string parameter.");
  }
};
exports.default = _default;