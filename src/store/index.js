import Vue from 'vue'
import Vuex from 'vuex'
import eggs from './modules/eggs'
import error from './modules/error'
import eggForm from './modules/eggForm.js'
import dh from '../helpers/dateHelper.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    width: null,
    height: null,
    today: null,
    lastHttpStatus: null,
    links: [
      { key: 'Month', label: 'měsíc', href: "/month" },
      { key: 'Week', label: 'týden', href: "/week" },
      { key: 'Day', label: 'den', href: "/day" },
      { key: 'total', label: 'celkem', href: '/total'}
    ],
    subtitles: [
      'z vašich vajec uděláme iVejce',
      'online nástroj pro správu vašich vajec',
      'vaše vejce v našich rukách',
      'víme vše o vašich vejcích',
      'sdílejte svá vejce online ...',
      'máme k vašim vejcím respekt a zodpovědnost',
      'váš vaječný kalendář',
      'evidujeme, zpracováváme, zobrazujeme ... vy jen snášejte !',
      'záleží nám na pohodě vašich vajec',
      'už nikdy chaos ve vejcích',
      'už nikdy vejce v chaosu',
      'vaše vaječná databáze',
      'řešení vašich vaječných problémů',
      'systém pro všechno, co dokážete snést',
      'svěřte nám, jak jsou na tom vaše vejce',
      'uspořádejte si pohodlně svá vejce',
      'ani jedno vaše vejce nám není lhostejné',
      'snášejme vejce, nesnášejme nepřehlednost ... !',
      'víme, co vše jste již snesli ...',
      'vaše vejce jsou důležitá, neztrácejte o nich přehled !',
      'šťastný život se správně uspořádanými vejci',
      'jak postavit vejce na špici ? zapsat jej do iHen !'
    ],
    title: 'iHen',
    dayViewDateString: null,
    mondayWeekView: null,
    dayMonthView: null,
    week: null,
    month: null,
    todayDateString: null
  },
  mutations: {

    setLastHttpStatus (state, value) {
      state.lastHttpStatus = value
    },
    setWindowDimensions (state, payload) {
      state.width = payload.width
      state.height = payload.height
    },
    setDayViewDateString (state, value) {
      state.dayViewDateString = value
    },
    setTodayDateString (state, str) {
      state.todayDateString = str
    }
  },
  getters: {
    getWidth: state => state.width,
    getHeight: state => state.height,
    getTodayDateString: state => state.todayDateString,
    getLinks: state => state.links,
    getTitle: state => state.title,
    getSubtitle: state => index => state.subtitles[index],
    getDayViewDateString: state => state.dayViewDateString,
    getSubtitlesRange: state => state.subtitles.length,
    getLastHttpStatus: state => state.lastHttpStatus
  },
  actions: {
    initialize (context) {
      const todayDateString = dh.getDateString(new Date())
      context.commit('setTodayDateString', todayDateString)
    }
  },
  modules: {
    eggForm,
    eggs,
    error
  }
})
