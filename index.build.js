'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.journey = exports.fnFree = exports.fnFree_ERROR_RESOLVE_NOT_FN = exports.fnFree_ERROR_FN_NOT_FN = exports.fnReduce = exports.passThru = exports.isPromise = exports.coerceToPlainObject = exports.coerceToArray = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var coerceToArray = exports.coerceToArray = function coerceToArray(v) {
  return (0, _lodash.isArray)(v) ? v : [v];
};
var coerceToPlainObject = exports.coerceToPlainObject = function coerceToPlainObject(v) {
  return (0, _lodash.isPlainObject)(v) ? v : {};
};
var isPromise = exports.isPromise = function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

var passThru = exports.passThru = function passThru(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!fn) return args;
  var fnResult = fn.apply(null, args);
  if (isPromise(fnResult)) fnResult.then();
  return args;
};

var fnReduce = exports.fnReduce = function fnReduce(fns) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var hook = arguments[2];

  return fns.reduce(function (acq, fn) {
    var handleResult = function handleResult(acq, result) {
      return cleanResult.apply(null, hookResult(acq, result));
    };
    var cleanResult = function cleanResult(acq, result) {
      return _extends({}, coerceToPlainObject(acq), coerceToPlainObject(result));
    };
    var hookResult = function hookResult(acq, result) {
      return passThru(hook, acq, result);
    };
    var handleResultPossiblePromise = function handleResultPossiblePromise(acq, result) {
      var resultIsPromise = isPromise(result);
      if (resultIsPromise) return result.then(function (result) {
        return handleResult(acq, result);
      });
      return handleResult(acq, result);
    };
    var handleAcqPossiblePromise = function handleAcqPossiblePromise(acq) {
      var acqIsPromise = isPromise(acq);
      if (acqIsPromise) return acq.then(function (acq) {
        return handleResultPossiblePromise(acq, fn(acq));
      });
      return handleResultPossiblePromise(acq, fn(acq));
    };
    return handleAcqPossiblePromise(acq);
  }, state);
};

var fnFree_ERROR_FN_NOT_FN = exports.fnFree_ERROR_FN_NOT_FN = 'fn arg is not function type';
var fnFree_ERROR_RESOLVE_NOT_FN = exports.fnFree_ERROR_RESOLVE_NOT_FN = 'resolve arg is not function type';

var fnFree = exports.fnFree = function fnFree(fn, resolve) {
  if (typeof fn !== 'function') throw new Error(fnFree_ERROR_FN_NOT_FN);
  if (typeof resolve !== 'function') throw new Error(fnFree_ERROR_RESOLVE_NOT_FN);
  var main = function main() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var fnResult = fn.apply(null, args);
    if (isPromise(fnResult)) return fnResult.then(resolve);
    return resolve(fnResult);
  };
  main.journey = fn;
  main.results = fn;
  main.data = fn;
  main.flow = fn;
  main.core = fn;
  main.fall = fn;
  return main;
};

var journey = exports.journey = function journey(fnOfFns) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var resolve = void 0;
  if (typeof opts === 'function') {
    resolve = opts;
    opts = {};
    opts.resolve = resolve;
  }
  opts.hook = (0, _lodash.get)(opts, 'hook', false);
  opts.resolve = (0, _lodash.get)(opts, 'resolve', false);
  opts.return = (0, _lodash.get)(opts, 'return', false);
  opts.exports = (0, _lodash.get)(opts, 'exports', false);
  if (opts.exports) {
    opts.exports = coerceToArray(opts.exports);
    var e = (0, _lodash.zipObject)(opts.exports, opts.exports);
    return (0, _lodash.mapValues)(e, function (exp) {
      var _opts = (0, _lodash.clone)(opts);
      _opts.exports = null;
      _opts.return = exp;
      return journey(fnOfFns, _opts);
    });
  }
  if (!opts.resolve) {
    resolve = function resolve(v) {
      if (typeof opts.return === 'string') return (0, _lodash.get)(v, opts.return);
      if (opts.return) return (0, _lodash.get)(v, 'return');
      return v;
    };
  }
  var fn = function fn() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var fns = fnOfFns.apply(null, args);
    return fnReduce(fns, {}, opts.hook);
  };
  return fnFree(fn, resolve);
};

exports.default = journey;
