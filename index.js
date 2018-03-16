import {clone, get, mapValues, zipObject} from 'lodash'
import coerceToArray from '@reggi/journey.coerce-to-array'
import fnFree from '@reggi/journey.fn-free'
import fnReduce from '@reggi/journey.fn-reduce'

export const journey = (fnOfFns, opts = {}) => {
  let resolve
  if (typeof opts === 'function') {
    resolve = opts
    opts = {}
    opts.resolve = resolve
  }
  opts.hook = get(opts, 'hook', false)
  opts.resolve = get(opts, 'resolve', false)
  opts.return = get(opts, 'return', false)
  opts.exports = get(opts, 'exports', false)
  if (opts.exports) {
    opts.exports = coerceToArray(opts.exports)
    const e = zipObject(opts.exports, opts.exports)
    return mapValues(e, exp => {
      const _opts = clone(opts)
      _opts.exports = null
      _opts.return = exp
      return journey(fnOfFns, _opts)
    })
  }
  if (!opts.resolve) {
    resolve = (v) => {
      if (typeof opts.return === 'string') return get(v, opts.return)
      if (opts.return) return get(v, 'return')
      return v
    }
  }
  const fn = (...args) => {
    const fns = fnOfFns.apply(null, args)
    return fnReduce(fns, {}, opts.hook)
  }
  return fnFree(fn, resolve, ['journey', 'results', 'data', 'flow', 'core', 'fall'])
}

export default journey
