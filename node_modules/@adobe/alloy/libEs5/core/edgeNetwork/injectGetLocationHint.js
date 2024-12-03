"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _cookieNameKey = require("../../constants/cookieNameKey.js");
var _legacyCookies = require("../../constants/legacyCookies.js");
/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
var _default = ({
  orgId,
  cookieJar
}) => {
  const clusterCookieName = (0, _index.getNamespacedCookieName)(orgId, _cookieNameKey.CLUSTER);
  const fromClusterCookie = () => cookieJar.get(clusterCookieName);
  const fromTarget = () => {
    const mboxEdgeCluster = cookieJar.get(_legacyCookies.MBOX_EDGE_CLUSTER);
    if (mboxEdgeCluster) {
      return "t" + mboxEdgeCluster;
    }
    return undefined;
  };
  return () => {
    return fromClusterCookie() || fromTarget();
  };
};
exports.default = _default;