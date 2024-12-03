"use strict";

exports.default = void 0;
var _appendIdentityToUrlOptionsValidator = require("./appendIdentityToUrl/appendIdentityToUrlOptionsValidator.js");
var _ecidNamespace = require("../../constants/ecidNamespace.js");
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
var _default = ({
  addEcidQueryToPayload,
  addQueryStringIdentityToPayload,
  ensureSingleIdentity,
  setLegacyEcid,
  handleResponseForIdSyncs,
  getNamespacesFromResponse,
  getIdentity,
  consent,
  appendIdentityToUrl,
  logger,
  getIdentityOptionsValidator
}) => {
  let namespaces;
  let edge = {};
  return {
    lifecycle: {
      onBeforeRequest({
        request,
        onResponse,
        onRequestFailure
      }) {
        // Querying the ECID on every request to be able to set the legacy cookie, and make it
        // available for the `getIdentity` command.
        addEcidQueryToPayload(request.getPayload());
        addQueryStringIdentityToPayload(request.getPayload());
        return ensureSingleIdentity({
          request,
          onResponse,
          onRequestFailure
        });
      },
      onResponse({
        response
      }) {
        const newNamespaces = getNamespacesFromResponse(response);
        if ((!namespaces || !namespaces[_ecidNamespace.default]) && newNamespaces && newNamespaces[_ecidNamespace.default]) {
          // Only data collection calls will have an ECID in the response.
          // https://jira.corp.adobe.com/browse/EXEG-1234
          setLegacyEcid(newNamespaces[_ecidNamespace.default]);
        }
        namespaces = newNamespaces;
        // For sendBeacon requests, getEdge() will return {}, so we are using assign here
        // so that sendBeacon requests don't override the edge info from before.
        edge = {
          ...edge,
          ...response.getEdge()
        };
        return handleResponseForIdSyncs(response);
      }
    },
    commands: {
      getIdentity: {
        optionsValidator: getIdentityOptionsValidator,
        run: options => {
          const {
            namespaces: requestedNamespaces
          } = options;
          return consent.awaitConsent().then(() => {
            return namespaces ? undefined : getIdentity(options);
          }).then(() => {
            return {
              identity: requestedNamespaces.reduce((acc, namespace) => {
                acc[namespace] = namespaces[namespace] || null;
                return acc;
              }, {}),
              edge
            };
          });
        }
      },
      appendIdentityToUrl: {
        optionsValidator: _appendIdentityToUrlOptionsValidator.default,
        run: options => {
          return consent.withConsent().then(() => {
            return namespaces ? undefined : getIdentity(options);
          }).then(() => {
            return {
              url: appendIdentityToUrl(namespaces[_ecidNamespace.default], options.url)
            };
          }).catch(error => {
            logger.warn("Unable to append identity to url. " + error.message);
            return options;
          });
        }
      }
    }
  };
};
exports.default = _default;