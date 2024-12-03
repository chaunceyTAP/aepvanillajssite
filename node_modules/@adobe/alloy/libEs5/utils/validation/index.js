"use strict";

exports.string = exports.objectOf = exports.number = exports.mapOfValues = exports.literal = exports.enumOf = exports.callback = exports.boolean = exports.arrayOf = exports.anything = exports.anyOf = void 0;
var _utils = require("./utils.js");
var _booleanValidator = require("./booleanValidator.js");
var _callbackValidator = require("./callbackValidator.js");
var _createAnyOfValidator = require("./createAnyOfValidator.js");
var _createArrayOfValidator = require("./createArrayOfValidator.js");
var _createDefaultValidator = require("./createDefaultValidator.js");
var _createDeprecatedValidator = require("./createDeprecatedValidator.js");
var _createLiteralValidator = require("./createLiteralValidator.js");
var _createMapOfValuesValidator = require("./createMapOfValuesValidator.js");
var _createMinimumValidator = require("./createMinimumValidator.js");
var _createMaximumValidator = require("./createMaximumValidator.js");
var _createNoUnknownFieldsValidator = require("./createNoUnknownFieldsValidator.js");
var _createNonEmptyValidator = require("./createNonEmptyValidator.js");
var _createObjectOfValidator = require("./createObjectOfValidator.js");
var _createRenamedValidator = require("./createRenamedValidator.js");
var _createUniqueValidator = require("./createUniqueValidator.js");
var _createUniqueItemsValidator = require("./createUniqueItemsValidator.js");
var _domainValidator = require("./domainValidator.js");
var _integerValidator = require("./integerValidator.js");
var _numberValidator = require("./numberValidator.js");
var _regexpValidator = require("./regexpValidator.js");
var _requiredValidator = require("./requiredValidator.js");
var _stringValidator = require("./stringValidator.js");
var _matchesRegexpValidator = require("./matchesRegexpValidator.js");
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

/**
 * Validators are functions of two parameters (value and path) that return the
 * computed value if the input is valid, or throw an exception if the input is
 * invalid. In most cases the returned value is the same as the input value;
 * however, reference createDefaultValidator.js to see an example where the
 * computed value is different from the input. Additionally, if we ever wanted
 * to coerce types (i.e. parse string values into integers) as part of the
 * validation process we could use the computed value to accomplish that.
 *
 * The path parameter is used to generate informative error messages. It is
 * created by the objectOf, and arrayOf validators so that any error message can
 * describe which key within the object or array is invalid.
 *
 * The validators also have methods to chain additional validation logic. For
 * example, when you call `string()` to start a validator chain, it returns a
 * validator function but it also has methods like `required` and `nonEmpty`.
 * Here you can see that these methods are actually calling `chain`.
 * Specifically in this function, the leftValidator is called first and then the
 * return value of that is sent to the rightValidator. For example, when calling
 * `string().nonEmpty().required()` the following chain is built up:
 * ```
 *              *
 *            /   \
 *          *     required
 *        /   \
 *      *     nonEmpty
 *    /   \
 * base   string
 * ```
 * Where every * is a call to chain where the two are combined. The individual
 * validators are called from left to right in the above tree. The base
 * validator is simply the identity function `value => value`, representing an
 * optional value.
 *
 * After combining the validators, the new validator function is then augmented
 * with the methods from the leftValidator and from the additionalMethods
 * parameter. For example, when the string() function is called it chains to the
 * base validator, but also adds additional methods like (`regexp`, `domain`,
 * `nonEmpty`, and `unique`). When `nonEmpty` is called, which calls chain
 * again, the additional methods are carried forward because they are already
 * defined on the leftValidator.
 *
 * The base validator also contains the two methods `required` and `default`, so
 * these can be used anywhere after any of the exposed validator functions are
 * called.
 *
 * For most validators, we want the validation to be optional (i.e. allow null
 * or undefined values). To accomplish this, the validator needs to have a check
 * at the begining of the function, short circuiting the validation logic and
 * returning value if value is null or undefined. `default` and `required` do
 * not want this null check though. Indeed, `default` should return the default
 * value if value is null, and `required` should throw an error if value is
 * null.
 *
 * So to keep from having to have a null check in front of most validators,
 * nullSafeChain allows you to chain a validator in a null-safe way.
 */

// The base validator does no validation and just returns the value unchanged
const base = value => value;

// The 'default', 'required', and 'deprecated' methods are available after any
// data-type method. Don't use the nullSafeChain on 'default' or 'required'
// because they need to handle the null or undefined case
base.default = function _default(defaultValue) {
  return (0, _utils.chain)(this, (0, _createDefaultValidator.default)(defaultValue));
};
base.required = function required() {
  return (0, _utils.chain)(this, _requiredValidator.default);
};
base.deprecated = function deprecated(message) {
  return (0, _utils.chain)(this, (0, _createDeprecatedValidator.default)(message));
};

// helper validators
const domain = function domain() {
  return (0, _utils.nullSafeChain)(this, _domainValidator.default);
};
const minimumInteger = function minimumInteger(minValue) {
  return (0, _utils.nullSafeChain)(this, (0, _createMinimumValidator.default)("an integer", minValue));
};
const minimumNumber = function minimumNumber(minValue) {
  return (0, _utils.nullSafeChain)(this, (0, _createMinimumValidator.default)("a number", minValue));
};
const maximumNumber = function maximumNumber(maxValue) {
  return (0, _utils.nullSafeChain)(this, (0, _createMaximumValidator.default)("a number", maxValue));
};
const integer = function integer() {
  return (0, _utils.nullSafeChain)(this, _integerValidator.default, {
    minimum: minimumInteger
  });
};
const nonEmptyString = function nonEmptyString() {
  return (0, _utils.nullSafeChain)(this, (0, _createNonEmptyValidator.default)("a non-empty string"));
};
const nonEmptyArray = function nonEmptyArray() {
  return (0, _utils.nullSafeChain)(this, (0, _createNonEmptyValidator.default)("a non-empty array"));
};
const nonEmptyObject = function nonEmptyObject() {
  return (0, _utils.nullSafeChain)(this, (0, _createNonEmptyValidator.default)("a non-empty object"));
};
const regexp = function regexp() {
  return (0, _utils.nullSafeChain)(this, _regexpValidator.default);
};
const matches = function matches(regexpPattern) {
  return (0, _utils.nullSafeChain)(this, (0, _matchesRegexpValidator.default)(regexpPattern));
};
const unique = function createUnique() {
  return (0, _utils.nullSafeChain)(this, (0, _createUniqueValidator.default)());
};
const uniqueItems = function createUniqueItems() {
  return (0, _utils.nullSafeChain)(this, (0, _createUniqueItemsValidator.default)());
};

// top-level validators.  These are the first functions that are called to create a validator.
const anyOf = function anyOf(validators, message) {
  // use chain here because we don't want to accept null or undefined unless at least
  // one of the validators accept null or undefined.
  return (0, _utils.chain)(this, (0, _createAnyOfValidator.default)(validators, message));
};
const anything = function anything() {
  return this;
};
const arrayOf = function arrayOf(elementValidator) {
  return (0, _utils.nullSafeChain)(this, (0, _createArrayOfValidator.default)(elementValidator), {
    nonEmpty: nonEmptyArray,
    uniqueItems
  });
};
const boolean = function boolean() {
  return (0, _utils.nullSafeChain)(this, _booleanValidator.default);
};
const callback = function callback() {
  return (0, _utils.nullSafeChain)(this, _callbackValidator.default);
};
const literal = function literal(literalValue) {
  return (0, _utils.nullSafeChain)(this, (0, _createLiteralValidator.default)(literalValue));
};
const number = function number() {
  return (0, _utils.nullSafeChain)(this, _numberValidator.default, {
    minimum: minimumNumber,
    maximum: maximumNumber,
    integer,
    unique
  });
};
const mapOfValues = function mapOfValues(valuesValidator) {
  return (0, _utils.nullSafeChain)(this, (0, _createMapOfValuesValidator.default)(valuesValidator), {
    nonEmpty: nonEmptyObject
  });
};
const createObjectOfAdditionalProperties = schema => ({
  noUnknownFields: function noUnknownFields() {
    return (0, _utils.nullSafeChain)(this, (0, _createNoUnknownFieldsValidator.default)(schema));
  },
  nonEmpty: nonEmptyObject,
  concat: function concat(otherObjectOfValidator) {
    // combine the schema so that noUnknownFields, and concat have the combined schema
    const newSchema = {
      ...schema,
      ...otherObjectOfValidator.schema
    };
    return (0, _utils.nullSafeChain)(this, otherObjectOfValidator, createObjectOfAdditionalProperties(newSchema));
  },
  renamed: function renamed(oldField, oldSchema, newField) {
    // Run the deprecated validator first so that the deprecated field is removed
    // before the objectOf validator runs.
    return (0, _utils.reverseNullSafeChainJoinErrors)(this, (0, _createRenamedValidator.default)(oldField, oldSchema, newField));
  },
  schema
});
const objectOf = function objectOf(schema) {
  return (0, _utils.nullSafeChain)(this, (0, _createObjectOfValidator.default)(schema), createObjectOfAdditionalProperties(schema));
};
const string = function string() {
  return (0, _utils.nullSafeChain)(this, _stringValidator.default, {
    regexp,
    domain,
    nonEmpty: nonEmptyString,
    unique,
    matches
  });
};
const boundAnyOf = exports.anyOf = anyOf.bind(base);
const boundAnything = exports.anything = anything.bind(base);
const boundArrayOf = exports.arrayOf = arrayOf.bind(base);
const boundBoolean = exports.boolean = boolean.bind(base);
const boundCallback = exports.callback = callback.bind(base);
const boundLiteral = exports.literal = literal.bind(base);
const boundNumber = exports.number = number.bind(base);
const boundMapOfValues = exports.mapOfValues = mapOfValues.bind(base);
const boundObjectOf = exports.objectOf = objectOf.bind(base);
const boundString = exports.string = string.bind(base);

// compound validators
const boundEnumOf = exports.enumOf = function boundEnumOf(...values) {
  return boundAnyOf(values.map(boundLiteral), "one of these values: " + JSON.stringify(values));
};