import {clone, isArray, isPlainObject, get, mapValues, zipObject} from 'lodash'

export const coerceToArray = (v) => isArray(v) ? v : [v]
export const coerceToPlainObject = (v) => isPlainObject(v) ? v : {}
export const isPromise = (obj) => !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'

export const passThru = (fn, ...args) => {
  if (!fn) return args
  const fnResult = fn.apply(null, args)
  if (isPromise(fnResult)) fnResult.then()
  return args
}

export const fnReduce = (fns, state = {}, hook) => {
  return fns.reduce((acq, fn) => {
    const handleResult = (acq, result) => cleanResult.apply(null, hookResult(acq, result))
    const cleanResult = (acq, result) => ({...coerceToPlainObject(acq), ...coerceToPlainObject(result)})
    const hookResult = (acq, result) => passThru(hook, acq, result)
    const handleResultPossiblePromise = (acq, result) => {
      const resultIsPromise = isPromise(result)
      if (resultIsPromise) return result.then(result => handleResult(acq, result))
      return handleResult(acq, result)
    }
    const handleAcqPossiblePromise = (acq) => {
      const acqIsPromise = isPromise(acq)
      if (acqIsPromise) return acq.then(acq => handleResultPossiblePromise(acq, fn(acq)))
      return handleResultPossiblePromise(acq, fn(acq))
    }
    return handleAcqPossiblePromise(acq)
  }, state)
}

export const fnFree_ERROR_FN_NOT_FN = 'fn arg is not function type'
export const fnFree_ERROR_RESOLVE_NOT_FN = 'resolve arg is not function type'

export const fnFree = (fn, resolve) => {
  if (typeof fn !== 'function') throw new Error(fnFree_ERROR_FN_NOT_FN)
  if (typeof resolve !== 'function') throw new Error(fnFree_ERROR_RESOLVE_NOT_FN)
  const main = (...args) => {
    const fnResult = fn.apply(null, args)
    if (isPromise(fnResult)) return fnResult.then(resolve)
    return resolve(fnResult)
  }
  main.journey = fn
  main.results = fn
  main.data = fn
  main.flow = fn
  main.core = fn
  main.fall = fn
  return main
}

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
  return fnFree(fn, resolve)
}

export default journey
