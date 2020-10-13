import { lower, trim, ucfirst, ucwords } from './helper.js'
import { isValidTime } from './timeHelper.js'
import dh from './dateHelper.js'
const isValue = (value) => {
  if (Array.isArray(value)) return !!value.length
  if (value === undefined || value === null) return false
  if (value === false) return true
  if (value instanceof Date) return !isNaN(value.getTime())
  if (typeof value === 'object') {
    for (const x in value) {
      return true
    }
    return false
  }
  return !!String(value).length
}
const regexp = (value, re) => {
  return !isValue(value) || re.test(value)
}
const getLen = (value) => {
  const type = typeof value
  if (type === 'string') return value.length
  if (type === 'object' && value !== null) return Object.keys(value).length
  if (Array.isArray(value)) return value.length
  return false
}

export default {
  required (value) {
    return typeof value === 'string' ? isValue(value.trim()) : isValue(value)
  },
  email (value) {
    const re = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/
    return regexp(value, re)
  },
  numeric (value) {
    const re = /^[0-9]*$/
    return regexp(value, re)
  },
  alphanumeric (value) {
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ]*$/
    return regexp(value, re)
  },
  minLength (value, param) {
    if (!isValue(value)) return true
    const len = getLen(value)
    return typeof len === 'number' && len >= param
  },
  maxValue (value, param) {
    if (!isValue(value)) return true
    const num = parseFloat(value, 10)
    return !isNaN(num) && num <= param
  },
  minValue (value, param) {
    if (!isValue(value)) return true
    const num = parseFloat(value, 10)
    return !isNaN(num) && num >= param
  },
  maxLength (value, param) {
    if (!isValue(value)) return true
    const len = getLen(value)
    return typeof len === 'number' && len <= param
  },
  valueList (value, param) {
    if (!isValue(value)) return true
    const val = '' + value
    return param.indexOf(val) > -1
  },
  validTime (value) {
    return !isValue(value) || isValidTime(value)
  },
  isValidDate (value) {
    return !isValue(value) || dh.isValidDate(value)
  },
  applyModifiers (value, modifiers) {
    const obj = {
      lower,
      ucwords,
      ucfirst,
      trim
    }
    return modifiers.reduce((acc, modifier) => {
      return obj[modifier](acc)
    }, value)
  }
}
