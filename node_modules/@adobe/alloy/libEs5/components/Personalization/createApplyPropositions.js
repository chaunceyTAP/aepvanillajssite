"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _schema = require("../../constants/schema.js");
var _pageWideScope = require("../../constants/pageWideScope.js");
var _initDomActionsModules = require("./dom-actions/initDomActionsModules.js");
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

const isInteractionTrackingItem = (schema, actionType) => schema === _schema.JSON_CONTENT_ITEM && actionType === _initDomActionsModules.DOM_ACTION_COLLECT_INTERACTIONS;
const SUPPORTED_SCHEMAS = {
  [_schema.DOM_ACTION]: () => true,
  [_schema.HTML_CONTENT_ITEM]: () => true,
  [_schema.JSON_CONTENT_ITEM]: isInteractionTrackingItem,
  [_schema.MESSAGE_IN_APP]: () => true,
  [_schema.DEFAULT_CONTENT_ITEM]: () => true
};
const filterItemsPredicate = (schema, actionType) => typeof SUPPORTED_SCHEMAS[schema] === "function" && SUPPORTED_SCHEMAS[schema](schema, actionType);
var _default = ({
  processPropositions,
  createProposition,
  renderedPropositions,
  viewCache
}) => {
  const updatePropositionItems = ({
    items,
    metadataForScope = {}
  }) => {
    const {
      actionType,
      selector
    } = metadataForScope;
    return items.filter(item => filterItemsPredicate(item.schema, actionType)).map(item => {
      const {
        schema
      } = item;
      if (schema !== _schema.HTML_CONTENT_ITEM && !isInteractionTrackingItem(schema, actionType)) {
        return {
          ...item
        };
      }
      if (!(0, _index.isEmptyObject)(metadataForScope)) {
        return {
          ...item,
          schema: isInteractionTrackingItem(schema, actionType) ? _schema.DOM_ACTION : schema,
          data: {
            ...item.data,
            selector,
            type: actionType
          }
        };
      }
      return undefined;
    }).filter(item => item);
  };
  const filterPropositionsPredicate = proposition => {
    return !(proposition.scope === _pageWideScope.default && proposition.renderAttempted);
  };
  const preparePropositions = ({
    propositions,
    metadata
  }) => {
    return propositions.filter(filterPropositionsPredicate).map(proposition => {
      if ((0, _index.isNonEmptyArray)(proposition.items)) {
        const {
          id,
          scope,
          scopeDetails
        } = proposition;
        return {
          id,
          scope,
          scopeDetails,
          items: updatePropositionItems({
            items: proposition.items,
            metadataForScope: metadata[proposition.scope]
          })
        };
      }
      return proposition;
    }).filter(proposition => (0, _index.isNonEmptyArray)(proposition.items));
  };
  return ({
    propositions = [],
    metadata = {},
    viewName
  }) => {
    // We need to immediately call concat so that subsequent sendEvent
    // calls will wait for applyPropositions to complete before executing.
    const renderedPropositionsDeferred = (0, _index.defer)();
    renderedPropositions.concat(renderedPropositionsDeferred.promise);
    const propositionsToExecute = preparePropositions({
      propositions,
      metadata
    }).map(proposition => createProposition(proposition));
    return Promise.resolve().then(() => {
      if (viewName) {
        return viewCache.getView(viewName);
      }
      return [];
    }).then(additionalPropositions => {
      const {
        render,
        returnedPropositions
      } = processPropositions([...propositionsToExecute, ...additionalPropositions]);
      render().then(renderedPropositionsDeferred.resolve);
      return {
        propositions: returnedPropositions
      };
    });
  };
};
exports.default = _default;