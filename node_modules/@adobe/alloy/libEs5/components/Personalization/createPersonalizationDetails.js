"use strict";

exports.default = void 0;
var _index = require("../../utils/index.js");
var _surfaceUtils = require("./utils/surfaceUtils.js");
var _pageWideScope = require("../../constants/pageWideScope.js");
var _schema = require("../../constants/schema.js");
/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const addPageWideScope = scopes => {
  if (!scopes.includes(_pageWideScope.default)) {
    scopes.push(_pageWideScope.default);
  }
};
const addPageSurface = (surfaces, getPageLocation) => {
  const pageSurface = (0, _surfaceUtils.buildPageSurface)(getPageLocation);
  if (!surfaces.includes(pageSurface)) {
    surfaces.push(pageSurface);
  }
};
const dedupe = array => array.filter((item, pos) => array.indexOf(item) === pos);
var _default = ({
  getPageLocation,
  renderDecisions,
  decisionScopes,
  personalization,
  event,
  isCacheInitialized,
  logger
}) => {
  const viewName = event.getViewName();
  return {
    isRenderDecisions() {
      return renderDecisions;
    },
    isSendDisplayEvent() {
      return !!personalization.sendDisplayEvent;
    },
    shouldIncludeRenderedPropositions() {
      return !!personalization.includeRenderedPropositions;
    },
    getViewName() {
      return viewName;
    },
    hasScopes() {
      return decisionScopes.length > 0 || (0, _index.isNonEmptyArray)(personalization.decisionScopes);
    },
    hasSurfaces() {
      return (0, _index.isNonEmptyArray)(personalization.surfaces);
    },
    hasViewName() {
      return (0, _index.isNonEmptyString)(viewName);
    },
    createQueryDetails() {
      const scopes = [...decisionScopes];
      if ((0, _index.isNonEmptyArray)(personalization.decisionScopes)) {
        scopes.push(...personalization.decisionScopes);
      }
      const eventSurfaces = (0, _surfaceUtils.normalizeSurfaces)(personalization.surfaces, getPageLocation, logger);
      if (this.shouldRequestDefaultPersonalization()) {
        addPageWideScope(scopes);
        addPageSurface(eventSurfaces, getPageLocation);
      }
      const schemas = [_schema.DEFAULT_CONTENT_ITEM, _schema.HTML_CONTENT_ITEM, _schema.JSON_CONTENT_ITEM, _schema.REDIRECT_ITEM, _schema.RULESET_ITEM, _schema.MESSAGE_IN_APP, _schema.MESSAGE_CONTENT_CARD];
      if (scopes.includes(_pageWideScope.default)) {
        schemas.push(_schema.DOM_ACTION);
      }
      return {
        schemas,
        decisionScopes: dedupe(scopes),
        surfaces: dedupe(eventSurfaces)
      };
    },
    isCacheInitialized() {
      return isCacheInitialized;
    },
    shouldFetchData() {
      return this.hasScopes() || this.hasSurfaces() || this.shouldRequestDefaultPersonalization();
    },
    shouldUseCachedData() {
      return this.hasViewName() && !this.shouldFetchData();
    },
    shouldRequestDefaultPersonalization() {
      return personalization.defaultPersonalizationEnabled || !this.isCacheInitialized() && personalization.defaultPersonalizationEnabled !== false;
    }
  };
};
exports.default = _default;