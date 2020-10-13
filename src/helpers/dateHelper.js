import { dayNames, dayNamesShort, monthGenitives, monthNames, monthNamesShort, yearHolidays } from './constants.js'
import { get2DigitsString, isNumeric } from './helper.js'

export default {
  getDateString (dt) {
    return dt.getFullYear() + '-' + get2DigitsString(dt.getMonth() + 1) + '-' + get2DigitsString(dt.getDate())
  },
  getSunday (monday) {
    const mondayTime = monday.getTime()
    const dt = new Date(mondayTime)
    dt.setDate(dt.getDate() + 6)
    const sundayTime = dt.getTime()
    return new Date(sundayTime)
  },
  equalDates (dt1, dt2) {
    return (dt1.getDate() === dt2.getDate()) && (dt1.getMonth() === dt2.getMonth()) && (dt1.getFullYear() === dt2.getFullYear())
  },
  getEasterSunday (year) {
    const a = year % 19
    const b = Math.floor(year / 100)
    const c = year % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const n0 = (h + l + 7 * m + 114)
    const n = Math.floor(n0 / 31) - 1
    const p = n0 % 31 + 1
    const date = new Date(year, n, p)
    return date
  },
  getEasterFriday (year) {
    const sunday = this.getEasterSunday(year)
    sunday.setDate(sunday.getDate() - 2)
    const time = sunday.getTime()
    return new Date(time)
  },
  getEasterMonday (year) {
    const sunday = this.getEasterSunday(year)
    sunday.setDate(sunday.getDate() + 1)
    const time = sunday.getTime()
    return new Date(time)
  },
  isHoliday (dt) {
    const month = dt.getMonth() + 1
    const stringMonth = (month < 10 ? '0' : '') + month
    const date = dt.getDate()
    const stringDate = (date < 10 ? '0' : '') + date
    const str = stringMonth + '-' + stringDate
    if (yearHolidays.indexOf(str) > -1) return true
    if ([3, 4].indexOf(month) < 0) return false
    const day = dt.getDay()
    if ([1, 5].indexOf(day) < 0) return false
    const year = dt.getFullYear()
    return day === 1 ? this.equalDates(dt, this.getEasterMonday(year)) : this.equalDates(dt, this.getEasterFriday(year))
  },
  isWeekend (dt) {
    return [0, 6].indexOf(dt.getDay()) > -1
  },
  getDayName (dt, short = false) {
    if (!(dt instanceof Date)) return false
    return short ? dayNamesShort[dt.getDay()] : dayNames[dt.getDay()]
  },
  getDayNames (short = false, fromMonday = true) {
    if (short) return fromMonday ? dayNamesShort.slice(1).concat([dayNamesShort[0]]) : dayNamesShort
    return fromMonday ? dayNames.slice(1).concat([dayNames[0]]) : dayNames
  },
  formatDate (str, formatIn = 'YYYY-MM-DD', formatOut = 'D. M. YYYY') {
    return !str ? '' : this.formatDateFromObject(this.stringToDateObject(str, formatIn), formatOut)
  },
  stringToDateObject (str, format) {
    if (!str) return null
    const obj = {
      Y (value, format) {
        if (format.length === 4) return parseInt(value, 10)
        if (format.length !== 2) throw new Error('invalid format')
        return parseInt(value, 10) < 70 ? parseInt(('20' + value), 10) : parseInt(('19' + value), 10)
      },
      M (value, format) {
        if (format.length < 3) return parseInt(value, 10) - 1
        if (format.length > 5) throw new Error('invalid format')
        if (format.length === 3) return monthNamesShort.indexOf(value)
        return (format.length === 4) ? monthNames.indexOf(value) : monthGenitives.indexOf(value)
      },
      D (value) {
        return parseInt(value, 10)
      }
    }
    const delimiters = format.split(/[YMD]+/)
    const splitedFormat = format.split(/[^YMD]+/)
    const data = {
      formats: { Y: '', M: '', D: '' },
      values: { Y: '', M: '', D: '' },
    }
    splitedFormat.forEach(item => {
      data.formats[item.charAt(0)] = item
    })
    let splitedValue = str.split(delimiters[1])
    data.values[splitedFormat[0].charAt(0)] = splitedValue[0]
    if (splitedValue.length === 2) {
      let splitedOtherTwoValues = splitedValue[1].split(delimiters[2])
      data.values[splitedFormat[1].charAt(0)] = splitedOtherTwoValues[0]
      data.values[splitedFormat[2].charAt(0)] = splitedOtherTwoValues[1]
    } else {
      data.values[splitedFormat[1].charAt(0)] = splitedValue[1]
      data.values[splitedFormat[2].charAt(0)] = splitedValue[2]
    }
    return new Date(obj.Y(data.values.Y, data.formats.Y), obj.M(data.values.M, data.formats.M), obj.D(data.values.D))
  },
  formatDateFromObject (dt, format) {
    if (!dt) return ''
    const result = (format.match(/D/g)).length > 2 ? [dayNames[dt.getDay()] + ' '] : []
    const delimiters = format.split(/[YMD]+/)
    const splitedFormat = format.split(/[^YMD]+/)
    const obj = {
      M (f, dt) {
        if (f < 1 || f > 5) throw new Error('invalid format')
        const v = dt.getMonth()
        if (f === 1) return '' + (v + 1)
        if (f === 2) return get2DigitsString(v + 1)
        if (f === 3) return monthNamesShort[v]
        return (f === 4) ? monthNames[v] : monthGenitives[v]
      },
      D (f, dt) {
        const v = dt.getDate()
        return (f === 2 || f === 4) ? get2DigitsString(v) : '' + v
      },
      Y (f, dt) {
        const str = '' + dt.getFullYear()
        return f === 4 ? str : str.substr(2, 2)
      }
    }
    result.push(
      obj[splitedFormat[0].charAt(0)](splitedFormat[0].length, dt),
      delimiters[1],
      obj[splitedFormat[1].charAt(0)](splitedFormat[1].length, dt),
      delimiters[2],
      obj[splitedFormat[2].charAt(0)](splitedFormat[2].length, dt)
    )
    return result.join('')
  },
  getStringFromDate (dt, format) {
    const obj = this.parseDateFormat(format)
    const day = dt.getDate()
    const month = dt.getMonth()
    let dayOut
    if (obj.day === 'D') dayOut = '' + day
    else if (obj.day === 'DD') dayOut = day < 10 ? '0' + day : '' + day
    let monthOut
    if (obj.month === 'M') monthOut = '' + (month + 1)
    else if (obj.month === 'MM') monthOut = month < 9 ? '0' + (month + 1) : '' + (month + 1)
    else if (obj.month === 'MMM') monthOut = monthNamesShort[month]
    else monthOut = obj.month === 'MMMM' ? monthNames[month] : monthGenitives[month]
    let yearOut = '' + dt.getFullYear()
    if (obj.year === 'YY') yearOut = yearOut.substr(2, 2)
    let result = ''
    if (obj.first === 'year') result = yearOut
    else result = obj.first === 'day' ? dayOut : monthOut
    result += obj.firstDelimiter
    if (obj.second === 'year') result += yearOut
    else if (obj.second === 'day') result += dayOut
    else result += monthOut
    result += obj.secondDelimiter
    if (obj.third === 'year') return result + yearOut
    if (obj.third === 'month') return result + monthOut
    return result + dayOut
  },
  getDateFromString (str, format = 'YYYY-MM-DD') {
    const values = this.getDateValuesFromString(str, format)
    return new Date(values.year, values.month, values.day)
  },
  getDateValuesFromString (str, format = 'YYYY-MM-DD') {
    let obj = this.parseDateFormat(format)
    const values = { day: null, month: null, year: null }
    const returnValues = { day: null, month: null, year: null }
    const splited = str.split(obj.firstDelimiter)
    values[obj.first] = splited[0]
    if (splited.length === 3) {
      values[obj.second] = splited[1]
      values[obj.third] = splited[2]
    } else {
      const splitedMore = splited[1].split(obj.secondDelimiter)
      values[obj.second] = splitedMore[0]
      values[obj.third] = splitedMore[1]
    }
    returnValues.day = parseInt(values.day, 10)
    if (isNaN(returnValues.day)) throw new Error('invalid date format')
    if (obj.year === 'YY') {
      returnValues.year = parseInt(values.year, 10) < 70 ? parseInt('20' + values.year, 10) : parseInt('19' + values.year, 10)
    } else returnValues.year = parseInt(values.year, 10)
    if (isNaN(returnValues.year)) throw new Error('invalid date format')
    if (obj.month === 'M' || obj.month === 'MM') returnValues.month = parseInt(values.month, 10) - 1
    else if (obj.month === 'MMM') returnValues.month = monthNamesShort.indexOf(values.month)
    else if (obj.month === 'MMMM') returnValues.month = monthNames.indexOf(values.month)
    else if (obj.month === 'MMMMM') returnValues.month = monthGenitives.indexOf(values.month)
    else throw new Error('invalid date format')
    return returnValues
  },
// str is supposed to be a dateString in format YYYY-MM-DD
  isPast (str, time) {
    const givenDate = new Date(str)
    givenDate.setHours(parseInt(time.substr(0, 2), 10))
    givenDate.setMinutes(parseInt(time.substr(3, 2), 10))
    const givenTime = givenDate.getTime()
    const dt = new Date()
    let timeNow = dt.getTime()
    if (givenTime === timeNow) timeNow = dt.getTime()
    return givenTime < dt.getTime()
  },
  isFuture (str, time) {
    return !this.isPast(str, time)
  },
  isValidDate (input, format = 'YYYY-MM-DD', yearMin = 1900, yearMax = 2200) {
    const checkYears = (d) => {
      const y = d.getFullYear()
      return y >= yearMin && y <= yearMax
    }
    if (input instanceof Date && !isNaN(input.valueOf())) {
      return checkYears(input)
    }
    if (typeof input !== 'string') {
      return false
    }
    const dt = this.stringToDateObject(input, format)
    return dt instanceof Date && !isNaN(dt.valueOf()) && checkYears(dt)
  },
  isValidDatePart (str) {
    const len = str.length
    let numb
    if (len === 0) return true
    if (len < 2) return isNumeric(str)
    if (len === 2) {
      numb = parseInt(str, 10)
      return !isNaN(numb) && numb <= 31 && numb > 0
    }
    if (len === 3) {
      numb = parseInt(str.substr(0, 2))
      return !isNaN(numb) && numb <= 31 && numb > 0
    }
    if (len < 8) return this.isValidDayMonth(str.substr(0, 4))
    if (len === 8) return this.isValidDate(str.slice(-4) + '-' + str.substr(2, 2) + '-' + str.substr(0, 2))
    return false
  },
  isValidDayMonth (string) {
    const day = string.substr(0, 2)
    const month = string.substr(2, 2)
    const result = this.isValidDate('2004-' + month + '-' + day)
    return result
  },
  leapYear (year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
  },
  maskDate (str) {
  const len = str.length
  if (len === 0) return ''
  if (len === 1) return str
  if (len === 2) return str + '.'
  if (len < 4) return str.substr(0, 2) + '.' + str.substr(2)
  if (len === 4) return str.substr(0, 2) + '.' + str.substr(2, 2) + '.'
  return str.substr(0, 2) + '.' + str.substr(2, 2) + '.' + str.substr(4)
  },
  parseDateFormat (format) {
    const len = format.length
    const obj = {
      firstDelimiter: '',
      secondDelimiter: '',
      year: '',
      month: '',
      day: '',
      first: '',
      second: '',
      third: ''
    }
    const setOrder = (part) => {
      if (!obj.first) obj.first = part
      else if (obj.first !== part) {
        if (!obj.second) obj.second = part
        else if (!obj.third && obj.second !== part) obj.third = part
      }
    }
    let lastDelimiter
    for (let i = 0; i < len; i += 1) {
      const x = format[i]
      if (['Y', 'M', 'D'].indexOf(x) > -1) lastDelimiter = false
      if (x === 'Y') {
        obj.year += 'Y'
        setOrder('year')
      } else if (x === 'M') {
        obj.month += 'M'
        setOrder('month')
      } else if (x === 'D') {
        obj.day += 'D'
        setOrder('day')
      } else {
        if ((obj.firstDelimiter === '' && obj.secondDelimiter === '') || lastDelimiter === 'first') {
          lastDelimiter = 'first'
          obj.firstDelimiter += x
        } else {
          obj.secondDelimiter += x
          lastDelimiter = 'second'
        }
      }
    }
    Object.keys(obj).forEach((key) => {
      if (obj[key] === '') {
        throw new Error('invalid date format')
      }
    })
    if ((obj.year.replace(/Y/g, '').length + obj.month.replace(/M/g, '').length + obj.day.replace(/D/g, '').length) > 0) {
      throw new Error('invalid date format')
    }
    return obj
  },
  getWeekNumber (dt) {
    const x = dt.valueOf() + ((3 - ((dt.getDay() + 6) % 7)) * 86400000)
    const jan1 = new Date(new Date(x).getFullYear(), 0, 1).valueOf()
    return Math.floor(Math.round((x - jan1) / 86400000) / 7) + 1
  },
  getWeekString (dt) {
    const wn = this.getWeekNumber(dt)
    const month = dt.getMonth()
    let year = dt.getFullYear()
    if (month === 11 && wn === 1) year += 1
    return '' + year + get2DigitsString(wn)
  },
  getNumberOfDays (month, year) {
    if ([3, 5, 8, 10].indexOf(month) > -1) return 30
    if (month !== 1) return 31
    return this.leapYear(year) ? 29 : 28
  },
  getWeekStringsOfMonth (month, year) {
    const dt = new Date(year, month, 1, 0, 0, 0, 0)
    const ar = []
    do {
      ar.push(this.getWeekString(dt))
      dt.setDate(dt.getDate() + 7)
    } while (dt.getMonth() <= month)
    return ar
  },
  getMonday (input) {
    let dt
    if (input instanceof Date) {
      const origTime = input.getTime()
      dt = new Date(origTime)
    } else {
      dt = new Date(input)
    }
    let day = dt.getDay()
    if (day === 1) return dt
    if (day === 0) day = 7
    dt.setDate(dt.getDate() - (day - 1))
    const time = dt.getTime()
    return new Date(time)
  },
  getMonthGenitive (month) {
    return monthGenitives[month]
  },
  getMonthName (month) {
    return monthNames[month]
  },
  getMonthNames () {
    return monthNames
  },
  getMonthString (month, year) {
    return year + get2DigitsString(month + 1)
  },
  getWeekDates (dt) {
    const monday = this.getMonday(dt)
    const times = [monday.getTime()]
    do {
      monday.setDate(monday.getDate() + 1)
      times.push(monday.getTime())
    } while (times.length < 7)
    return times.map(item => {
      return new Date(item)
    })
  }
}