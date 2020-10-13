import { get2DigitsString, isNumeric } from './helper.js'
export const formatTime = (str, toDbFormat = false) => {
  if (!str) return ''
  const x = str.substr(0, 5)
  return toDbFormat ? x + ':00' : x
}
export const isValidTime = (str) => {
  // :TODO rewrite function is validtime
  if (typeof str !== 'string') return false
  const splited = str.split(':')
  const len = splited.length
  if (len !== 2 && len !== 3) return false
  const hour = parseInt(splited[0], 10)
  const min = parseInt(splited[1], 10)
  const isValid = !isNaN(hour) && !isNaN(min) && min >= 0 && min <= 59 && hour >= 0 && hour <= 23
  if (len === 2) return isValid
  const sec = parseInt(splited[2], 10)
  return isValid && !isNaN(sec) && sec >= 0 && sec <= 59
}
export const getTimeStringFromDate = (dt, long = false) => {
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  const hoursString = get2DigitsString(hours)
  const minsString = get2DigitsString(mins)
  const str = hoursString + ':' + minsString
  return long ? str + ':00' : str
}
export const isValidTimePart = (str) => {
  const valid = (x, par) => {
    const y = parseInt(x, 10)
    return !isNaN(y) && y >= 0 && y <= par
  }
  const len = str.length
  if (len === 0) return true
  if (len < 2) return isNumeric(str)
  if (len === 2) return valid(str, 23)
  if (len === 3) return valid(str.substr(0, 2), 23) && isNumeric(str.substr(2))
  if (len < 5) return valid(str.substr(0, 2), 23) && valid(str.substr(2, 2), 59)
  if (len === 5) return valid(str.substr(0, 2), 23) && valid(str.substr(2, 2), 59) && isNumeric(str.substr(4))
  if (len === 6) return valid(str.substr(0, 2), 23) && valid(str.substr(2, 2), 59) && valid(str.substr(4, 2), 59)
  return false
}
export const maskTime = (str) => {
  const len = str.length
  if (len === 0) return ''
  if (len === 1) return str
  if (len === 2) return str + ':'
  if (len < 4) return str.substr(0, 2) + ':' + str.substr(2)
  if (len === 4) return str.substr(0, 2) + ':' + str.substr(2, 2) + ':'
  return str.substr(0, 2) + ':' + str.substr(2, 2) + ':' + str.substr(4, 2)
}
export const subtractTime = (time1, time2) => {
  const hour1 = parseInt(time1.substr(0, 2), 10)
  const hour2 = parseInt(time2.substr(0, 2), 10)
  const minute1 = parseInt(time1.substr(3, 2), 10)
  const minute2 = parseInt(time2.substr(3, 2), 10)
  const second1 = time1.length === 8 ? parseInt(time1.substr(6, 2), 10) : 0
  const second2 = time2.length === 8 ? parseInt(time2.substr(6, 2), 10) : 0
  let second = second1 - second2
  let minute = minute1 - minute2
  let hour = hour1 - hour2
  if (second < 0) {
    second += 60
    minute -= 1
  }
  if (minute < 0) {
    minute += 60
    hour -= 1
  }
  if (hour < 0) hour += 24
  return get2DigitsString(hour) + ':' + get2DigitsString(minute) + ':' + get2DigitsString(second)
}

export const addTime = (time1, time2) => {
  if (!time1) return !time2 ? '00:00' : time2
  if (!time2) return time1
  const hour1 = parseInt(time1.substr(0, 2), 10)
  const hour2 = parseInt(time2.substr(0, 2), 10)
  const minute1 = parseInt(time1.substr(3, 2), 10)
  const minute2 = parseInt(time2.substr(3, 2), 10)
  const sec1 = time1.length > 5 ? parseInt(time1.substr(6), 10) : 0
  const sec2 = time2.length > 5 ? parseInt(time2.substr(6), 10) : 0
  let hours = hour1 + hour2
  let minutes = minute1 + minute2
  let seconds = sec1 + sec2
  if (seconds > 59) {
    seconds -= 60
    minutes += 1
  }
  if (minutes > 59) {
    minutes -= 60
    hours += 1
  }
  return get2DigitsString(hours) + ':' + get2DigitsString(minutes) + ':' + get2DigitsString(seconds)
}

// d1, d2 - dateStrings YYYY-MM-DD, t1, t2 timeStrings
export const compareTimestamps = (d1, t1, d2, t2, operator = 'gt') => {
  const y1 = parseInt(d1.substr(0, 4), 10)
  const m1 = parseInt(d1.substr(5, 2), 10) - 1
  const day1 = parseInt(d1.substr(8, 2), 10)
  const h1 = parseInt(t1.substr(0, 2), 10)
  const min1 = parseInt(t1.substr(3, 2), 10)
  const y2 = parseInt(d2.substr(0, 4), 10)
  const m2 = parseInt(d2.substr(5, 2), 10) - 1
  const day2 = parseInt(d2.substr(8, 2), 10)
  const h2 = parseInt(t2.substr(0, 2), 10)
  const min2 = parseInt(t2.substr(3, 2), 10)
  const dt1 = new Date(y1, m1, day1, h1, min1)
  const dt2 = new Date(y2, m2, day2, h2, min2)
  const time1 = dt1.getTime()
  const time2 = dt2.getTime()
  if (operator === 'gt') return time1 > time2
  if (operator === 'ge') return time1 >= time2
  if (operator === 'lt') return time1 < time2
  if (operator === 'le') return time1 <= time2
  if (operator === 'eq') return time1 === time2
  if (operator === 'ne') return time1 !== time2
}
