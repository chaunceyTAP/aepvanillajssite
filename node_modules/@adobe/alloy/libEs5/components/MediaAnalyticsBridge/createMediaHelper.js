"use strict";

exports.default = void 0;
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
var _default = ({
  logger
}) => {
  const createMediaObject = (friendlyName, name, length, contentType, streamType) => {
    const mediaObject = {
      friendlyName,
      name,
      length,
      streamType,
      contentType
    };
    const validate = (0, _index.objectOf)({
      friendlyName: (0, _index.string)().nonEmpty(),
      name: (0, _index.string)().nonEmpty(),
      length: (0, _index.number)().required(),
      streamType: (0, _index.string)().nonEmpty(),
      contentType: (0, _index.string)().nonEmpty()
    });
    try {
      const result = validate(mediaObject);
      const sessionDetails = {
        name: result.name,
        friendlyName: result.friendlyName,
        length: result.length,
        streamType: result.streamType,
        contentType: result.contentType
      };
      return {
        sessionDetails
      };
    } catch (error) {
      logger.warn("An error occurred while creating the Media Object.", error);
      return {};
    }
  };
  const createAdBreakObject = (name, position, startTime) => {
    const adBreakObject = {
      friendlyName: name,
      offset: position,
      index: startTime
    };
    const validator = (0, _index.objectOf)({
      friendlyName: (0, _index.string)().nonEmpty(),
      offset: (0, _index.number)(),
      index: (0, _index.number)()
    });
    try {
      const result = validator(adBreakObject);
      const advertisingPodDetails = {
        friendlyName: result.friendlyName,
        offset: result.offset,
        index: result.index
      };
      return {
        advertisingPodDetails
      };
    } catch (error) {
      logger.warn("An error occurred while creating the Ad Break Object.", error);
      return {};
    }
  };
  const createAdObject = (name, id, position, length) => {
    const adObject = {
      friendlyName: name,
      name: id,
      podPosition: position,
      length
    };
    const validator = (0, _index.objectOf)({
      friendlyName: (0, _index.string)().nonEmpty(),
      name: (0, _index.string)().nonEmpty(),
      podPosition: (0, _index.number)(),
      length: (0, _index.number)()
    });
    try {
      const result = validator(adObject);
      const advertisingDetails = {
        friendlyName: result.friendlyName,
        name: result.name,
        podPosition: result.podPosition,
        length: result.length
      };
      return {
        advertisingDetails
      };
    } catch (error) {
      logger.warn("An error occurred while creating the Advertising Object.", error);
      return {};
    }
  };
  const createChapterObject = (name, position, length, startTime) => {
    const chapterDetailsObject = {
      friendlyName: name,
      offset: position,
      length,
      index: startTime
    };
    const validator = (0, _index.objectOf)({
      friendlyName: (0, _index.string)().nonEmpty(),
      offset: (0, _index.number)(),
      length: (0, _index.number)(),
      index: (0, _index.number)()
    });
    try {
      const result = validator(chapterDetailsObject);
      const chapterDetails = {
        friendlyName: result.friendlyName,
        offset: result.offset,
        index: result.index,
        length: result.length
      };
      return {
        chapterDetails
      };
    } catch (error) {
      logger.warn("An error occurred while creating the Chapter Object.", error);
      return {};
    }
  };
  const createStateObject = stateName => {
    const STATE_NAME_REGEX = /^[a-zA-Z0-9_]{1,64}$/;
    const validator = (0, _index.string)().matches(STATE_NAME_REGEX, "This is not a valid state name.");
    try {
      const result = validator(stateName);
      return {
        name: result
      };
    } catch (error) {
      logger.warn("An error occurred while creating the State Object.", error);
      return {};
    }
  };
  const createQoEObject = (bitrate, droppedFrames, fps, startupTime) => {
    const qoeObject = {
      bitrate,
      droppedFrames,
      fps,
      startupTime
    };
    const validator = (0, _index.objectOf)({
      bitrate: (0, _index.number)(),
      droppedFrames: (0, _index.number)(),
      fps: (0, _index.number)(),
      startupTime: (0, _index.number)()
    });
    try {
      const result = validator(qoeObject);
      return {
        bitrate: result.bitrate,
        droppedFrames: result.droppedFrames,
        framesPerSecond: result.fps,
        timeToStart: result.startupTime
      };
    } catch (error) {
      logger.warn("An error occurred while creating the QOE Object.", error);
      return {};
    }
  };
  return {
    createMediaObject,
    createAdBreakObject,
    createAdObject,
    createChapterObject,
    createStateObject,
    createQoEObject
  };
};
exports.default = _default;