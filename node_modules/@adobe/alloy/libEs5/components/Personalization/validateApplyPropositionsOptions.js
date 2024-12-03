"use strict";

exports.default = exports.EMPTY_PROPOSITIONS = void 0;
var _index = require("../../utils/validation/index.js");
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

const EMPTY_PROPOSITIONS = exports.EMPTY_PROPOSITIONS = {
  propositions: []
};
var _default = ({
  logger,
  options
}) => {
  const applyPropositionsOptionsValidator = (0, _index.objectOf)({
    propositions: (0, _index.arrayOf)((0, _index.objectOf)({
      id: (0, _index.string)().required(),
      scope: (0, _index.string)().required(),
      scopeDetails: (0, _index.objectOf)({
        decisionProvider: (0, _index.string)().required()
      }).required(),
      items: (0, _index.arrayOf)((0, _index.objectOf)({
        id: (0, _index.string)().required(),
        schema: (0, _index.string)().required(),
        data: (0, _index.objectOf)((0, _index.anything)())
      })).nonEmpty().required()
    }).required()).nonEmpty().required(),
    metadata: (0, _index.objectOf)((0, _index.anything)()),
    viewName: (0, _index.string)()
  }).required();
  try {
    return applyPropositionsOptionsValidator(options);
  } catch (e) {
    logger.warn("Invalid options for applyPropositions. No propositions will be applied.", e);
    return EMPTY_PROPOSITIONS;
  }
};
exports.default = _default;