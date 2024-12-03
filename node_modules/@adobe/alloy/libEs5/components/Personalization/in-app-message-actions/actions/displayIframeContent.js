"use strict";

exports.mobileOverlay = exports.displayHTMLContentInIframe = exports.default = exports.createIframeClickHandler = exports.createIframe = exports.buildStyleFromMobileParameters = void 0;
var _index = require("../../dom-actions/dom/index.js");
var _utils = require("../utils.js");
var _contentType = require("../../../../constants/contentType.js");
var _index2 = require("../../../../utils/index.js");
var _index3 = require("../../../../utils/dom/index.js");
var _index4 = require("../../../../utils/validation/index.js");
var _propositionEventType = require("../../../../constants/propositionEventType.js");
var _eventType = require("../../../../constants/eventType.js");
var _createRedirect = require("../../dom-actions/createRedirect.js");
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

const MESSAGING_CONTAINER_ID = "alloy-messaging-container";
const OVERLAY_CONTAINER_ID = "alloy-overlay-container";
const IFRAME_ID = "alloy-content-iframe";
const dismissMessage = () => [MESSAGING_CONTAINER_ID, OVERLAY_CONTAINER_ID].forEach(_utils.removeElementById);
const createIframeClickHandler = (interact, navigateToUrl = (0, _createRedirect.default)(window)) => {
  return event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const {
      target
    } = event;
    const anchor = target.tagName.toLowerCase() === "a" ? target : target.closest("a");
    if (!anchor) {
      return;
    }
    const {
      action,
      interaction,
      link,
      label,
      uuid
    } = (0, _utils.parseAnchor)(anchor);
    interact(action, {
      label,
      id: interaction,
      uuid,
      link
    });
    if (action === "dismiss") {
      dismissMessage();
    }
    if ((0, _index2.isNonEmptyString)(link) && link.length > 0) {
      navigateToUrl(link, true);
    }
  };
};
exports.createIframeClickHandler = createIframeClickHandler;
const createIframe = (htmlContent, clickHandler) => {
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(htmlContent, _contentType.TEXT_HTML);
  const scriptTag = htmlDocument.querySelector("script");
  if (scriptTag) {
    scriptTag.setAttribute("nonce", (0, _index.getNonce)());
  }
  const element = (0, _index3.createNode)("iframe", {
    src: URL.createObjectURL(new Blob([htmlDocument.documentElement.outerHTML], {
      type: "text/html"
    })),
    id: IFRAME_ID
  });
  element.addEventListener("load", () => {
    const {
      addEventListener
    } = element.contentDocument || element.contentWindow.document;
    addEventListener("click", clickHandler);
  });
  return element;
};
exports.createIframe = createIframe;
const renderMessage = (iframe, webParameters, container, overlay) => {
  [{
    id: OVERLAY_CONTAINER_ID,
    element: overlay
  }, {
    id: MESSAGING_CONTAINER_ID,
    element: container
  }, {
    id: IFRAME_ID,
    element: iframe
  }].forEach(({
    id,
    element
  }) => {
    const {
      style = {},
      params = {}
    } = webParameters[id];
    element.style = {
      ...element.style,
      ...style
    };
    const {
      parentElement = "body",
      insertionMethod = "appendChild",
      enabled = true
    } = params;
    const parent = document.querySelector(parentElement);
    if (enabled && parent && typeof parent[insertionMethod] === "function") {
      parent[insertionMethod](element);
    }
  });
};
const buildStyleFromMobileParameters = mobileParameters => {
  const {
    verticalAlign,
    width,
    horizontalAlign,
    backdropColor,
    height,
    cornerRadius,
    horizontalInset,
    verticalInset,
    uiTakeover = false
  } = mobileParameters;
  const style = {
    width: width ? width + "%" : "100%",
    backgroundColor: backdropColor || "rgba(0, 0, 0, 0.5)",
    borderRadius: cornerRadius ? cornerRadius + "px" : "0px",
    border: "none",
    position: uiTakeover ? "fixed" : "relative",
    overflow: "hidden"
  };
  if (horizontalAlign === "left") {
    style.left = horizontalInset ? horizontalInset + "%" : "0";
  } else if (horizontalAlign === "right") {
    style.right = horizontalInset ? horizontalInset + "%" : "0";
  } else if (horizontalAlign === "center") {
    style.left = "50%";
    style.transform = "translateX(-50%)";
  }
  if (verticalAlign === "top") {
    style.top = verticalInset ? verticalInset + "%" : "0";
  } else if (verticalAlign === "bottom") {
    style.position = "fixed";
    style.bottom = verticalInset ? verticalInset + "%" : "0";
  } else if (verticalAlign === "center") {
    style.top = "50%";
    style.transform = (horizontalAlign === "center" ? style.transform + " " : "") + "translateY(-50%)";
    style.display = "flex";
    style.alignItems = "center";
    style.justifyContent = "center";
  }
  if (height) {
    style.height = height + "vh";
  } else {
    style.height = "100%";
  }
  return style;
};
exports.buildStyleFromMobileParameters = buildStyleFromMobileParameters;
const mobileOverlay = mobileParameters => {
  const {
    backdropOpacity,
    backdropColor
  } = mobileParameters;
  const opacity = backdropOpacity || 0.5;
  const color = backdropColor || "#FFFFFF";
  const style = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "transparent",
    opacity,
    backgroundColor: color
  };
  return style;
};
exports.mobileOverlay = mobileOverlay;
const REQUIRED_PARAMS = ["enabled", "parentElement", "insertionMethod"];
const isValidWebParameters = webParameters => {
  if (!webParameters) {
    return false;
  }
  const ids = Object.keys(webParameters);
  if (!ids.includes(MESSAGING_CONTAINER_ID)) {
    return false;
  }
  if (!ids.includes(OVERLAY_CONTAINER_ID)) {
    return false;
  }
  const valuesArray = Object.values(webParameters);
  for (let i = 0; i < valuesArray.length; i += 1) {
    if (!(0, _index4.objectOf)(valuesArray[i], "style")) {
      return false;
    }
    if (!(0, _index4.objectOf)(valuesArray[i], "params")) {
      return false;
    }
    for (let j = 0; j < REQUIRED_PARAMS.length; j += 1) {
      if (!(0, _index4.objectOf)(valuesArray[i].params, REQUIRED_PARAMS[j])) {
        return false;
      }
    }
  }
  return true;
};
const generateWebParameters = mobileParameters => {
  if (!mobileParameters) {
    return undefined;
  }
  const {
    uiTakeover = false
  } = mobileParameters;
  return {
    [IFRAME_ID]: {
      style: {
        border: "none",
        width: "100%",
        height: "100%"
      },
      params: {
        enabled: true,
        parentElement: "#alloy-messaging-container",
        insertionMethod: "appendChild"
      }
    },
    [MESSAGING_CONTAINER_ID]: {
      style: buildStyleFromMobileParameters(mobileParameters),
      params: {
        enabled: true,
        parentElement: "body",
        insertionMethod: "appendChild"
      }
    },
    [OVERLAY_CONTAINER_ID]: {
      style: mobileOverlay(mobileParameters),
      params: {
        enabled: uiTakeover === true,
        parentElement: "body",
        insertionMethod: "appendChild"
      }
    }
  };
};

// eslint-disable-next-line default-param-last
const displayHTMLContentInIframe = (settings = {}, interact) => {
  dismissMessage();
  const {
    content,
    contentType,
    mobileParameters
  } = settings;
  let {
    webParameters
  } = settings;
  if (contentType !== _contentType.TEXT_HTML) {
    return;
  }
  const container = (0, _index3.createNode)("div", {
    id: MESSAGING_CONTAINER_ID
  });
  const iframe = createIframe(content, createIframeClickHandler(interact));
  const overlay = (0, _index3.createNode)("div", {
    id: OVERLAY_CONTAINER_ID
  });
  if (!isValidWebParameters(webParameters)) {
    webParameters = generateWebParameters(mobileParameters);
  }
  if (!webParameters) {
    return;
  }
  renderMessage(iframe, webParameters, container, overlay);
};
exports.displayHTMLContentInIframe = displayHTMLContentInIframe;
var _default = (settings, collect) => {
  return new Promise(resolve => {
    const {
      meta
    } = settings;
    displayHTMLContentInIframe(settings, (action, propositionAction) => {
      const propositionEventTypes = {};
      propositionEventTypes[_propositionEventType.PropositionEventType.INTERACT] = _eventType.EVENT_TYPE_TRUE;
      if (Object.values(_propositionEventType.PropositionEventType).indexOf(action) !== -1) {
        propositionEventTypes[action] = _eventType.EVENT_TYPE_TRUE;
      }
      collect({
        decisionsMeta: [meta],
        propositionAction,
        eventType: _eventType.INTERACT,
        propositionEventTypes: Object.keys(propositionEventTypes)
      });
    });
    resolve({
      meta
    });
  });
};
exports.default = _default;