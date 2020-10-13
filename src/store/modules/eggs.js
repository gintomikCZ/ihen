import Vue from 'vue'
import db from '@/helpers/db.js'
import dh from '@/helpers/dateHelper.js'
import { get2DigitsString } from '@/helpers/helper.js'
const pp = Promise.resolve()
export default {
  namespaced: true,
  state: {
    eggs: {},
    fetchedMonths: [],
    fetchedWeeks: [],
    totalCount: null,
    totalWeight: null,
    minEggWeight: null,
    maxEggWeight: null, 
    minEggDay: null,
    maxEggDay: null,
    oldestDay: null
  },
  getters: {
    getEgg: state => id => state.eggs[id],
    getDayEggKeys: state => dateString => Object.keys(state.eggs).filter(key => state.eggs[key].day === dateString),
    getMonthEggKeys: state => (month, year) => {
      const monthStr = get2DigitsString(month + 1)
      const first = '' + year + '-' + monthStr + '-01'
      const last = '' + year + '-' + monthStr + '-' + dh.getNumberOfDays(month, year)
      return Object.keys(state.eggs).filter(key => {
        return state.eggs[key].day <= last && state.eggs[key].day >= first
      })
    },
    getWeekEggKeys: state => (monday) => {
      const mondayStr = dh.getDateString(monday)
      const sundayStr = dh.getDateString(dh.getSunday(monday))
      return Object.keys(state.eggs).filter(key => {
        return state.eggs[key].day <= sundayStr && state.eggs[key].day >= mondayStr
      })
    },
    getTotalWeight: state => state.totalWeight,
    getTotalCount: state => state.totalCount,
    getMinEggDay: state => state.minEggDay,
    getMaxEggDay: state => state.maxEggDay,
    getMinEggWeight: state => state.minEggWeight,
    getMaxEggWeight: state => state.maxEggWeight,
    getOldestDay: state => state.oldestDay
  },
  mutations: {
    addFetchedRecords (state, data) {
      data.forEach(record => {
        const id = '' + record.id
        if (!(id in state.eggs)) {
          Vue.set(state.eggs, id, record)
        }
      })
    },
    addOrEditEgg (state, record) {
      const id = '' + record.id
      if (id in state.eggs) {
        Vue.delete(state.eggs, id)
      }
      Vue.set(state.eggs, id, record)
    },
    deleteEgg (state, id) {
      id = '' + id
      if (id in state.eggs) {
        Vue.delete(state.eggs, id)
      }
    },
    addFetchedWeek(state, value) {
      state.fetchedWeeks.push(value)
    },
    addFetchedMonth (state, value) {
      state.fetchedMonths.push(value)
    },
    setMinEgg (state, record) {
      state.minEggDay = record.day
      state.minEggWeight = record.weight
    },
    setMaxEgg (state, record) {
      state.maxEggDay = record.day
      state.maxEggWeight = record.weight
    },
    setAgregates (state, record) {
      state.totalWeight = record.totalweight
      state.totalCount = record.totalcount
    },
    setOldestDay (state, record) {
      state.oldestDay = record.day
    }
  },
  actions:{
    fetchDay (context, dateString) {
      return db.get('eggs?day=' + dateString).then((resp) => {
        context.commit('addFetchedRecords', resp)
      })
    },
    fetchMonth (context, payload) {
      const month = payload.month
      const year = payload.year
      const month2digits = get2DigitsString(month + 1)
      const monthStr = year + month2digits
      if (context.state.fetchedMonths.indexOf(monthStr) > -1) return pp
      const first = '' + year + '-' + month2digits + '-01'
      const last = '' + year + '-' + month2digits + '-' + dh.getNumberOfDays(month, year)
      return db.get('eggs?day:gte:' + first + '&day:lte:' + last).then((resp) => {
        context.commit('addFetchedRecords', resp)
        context.commit('addFetchedMonth', monthStr)
      })
    },
    fetchWeek (context, monday) {
      const mondayStr = dh.getDateString(monday)
      if (context.state.fetchedWeeks.indexOf(mondayStr) > -1) return pp
      const sundayStr = dh.getDateString(dh.getSunday(monday))
      return db.get('eggs?day:gte:' + mondayStr + '&day:lte:' + sundayStr).then((resp) => {
        context.commit('addFetchedRecords', resp)
        context.commit('addFetchedWeek', mondayStr)
      })
    },
    fetchEgg (context, id) {
      return db.get('eggs/' + id).then((record) => {
        context.commit('addOrEditEgg', record)
      })
    },
    deleteEgg (context, id) {
      return db.delete('eggs/' + id).then(() => {
        context.commit('deleteEgg', id)
      })
    },
    editEgg (context, data) {
      return db.put('eggs', data).then(() => {
        return context.dispatch('fetchEgg', data.id)
      })
    },
    fetchMaxEgg(context) {
      const query = 'SELECT * FROM eggs ORDER BY weight DESC LIMIT 1'
      return db.post('query', { query }).then((resp) => {
        context.commit('setMaxEgg', resp[0])
      })
    },
    fetchMinEgg (context) {
      const query = 'SELECT * FROM eggs ORDER BY weight ASC LIMIT 1'
      return db.post('query', { query }).then((resp) => {
        context.commit('setMinEgg', resp[0])
      })
    },
    fetchAgregates (context) {
      const query = 'SELECT COUNT(id) as totalcount, SUM(weight) as totalweight FROM eggs'
      return db.post('query', { query }).then((resp) => {
        context.commit('setAgregates', resp[0])
      })
    },
    fetchOldestDay (context) {
      const query = 'SELECT day from eggs ORDER BY day ASC LIMIT 1'
      return db.post('query', { query }).then((resp) => {
        context.commit('setOldestDay', resp[0])
      })
    },
    fetchTotal (context) {
      return Promise.all([
        context.dispatch('fetchMinEgg'),
        context.dispatch('fetchMaxEgg'),
        context.dispatch('fetchAgregates'),
        context.dispatch('fetchOldestDay')
      ])
    }
  }
}