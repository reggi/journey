'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.journey = undefined;

var _lodash = require('lodash');

var _journey = require('@reggi/journey.coerce-to-array');

var _journey2 = _interopRequireDefault(_journey);

var _journey3 = require('@reggi/journey.fn-free');

var _journey4 = _interopRequireDefault(_journey3);

var _journey5 = require('@reggi/journey.fn-reduce');

var _journey6 = _interopRequireDefault(_journey5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    opts.exports = (0, _journey2.default)(opts.exports);
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
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var fns = fnOfFns.apply(null, args);
    return (0, _journey6.default)(fns, {}, opts.hook);
  };
  return (0, _journey4.default)(fn, resolve, ['journey', 'results', 'data', 'flow', 'core', 'fall']);
};

exports.default = journey;
