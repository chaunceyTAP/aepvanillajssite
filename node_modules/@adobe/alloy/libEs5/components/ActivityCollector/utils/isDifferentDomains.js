"use strict";

exports.default = void 0;
var _extractDomain = require("./dom/extractDomain.js");
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
var _default = (uri1, uri2) => {
  const domain1 = (0, _extractDomain.default)(uri1);
  const domain2 = (0, _extractDomain.default)(uri2);
  return domain1 !== domain2;
};
exports.default = _default;