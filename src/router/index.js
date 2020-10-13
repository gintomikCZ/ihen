import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
import dh from '../helpers/dateHelper.js'

Vue.use(VueRouter)
const getToday = () => {
  const today = dh.getDateString(new Date())
  store.commit('setDayViewDateString', today)
  return today
}

const routes = [
  {
    path: '/',
    name: 'Home',
      component: () => import( '../views/IndexPage.vue')
  },
  {
    path: '/week/:day?',
    name: 'Week',
    component: () => import( '../views/week/WeekPage.vue'),
    beforeEnter: (to, from, next) => {
      if (!to.params.day) {
        if (!store.getters.getDayViewDateString) {
          next('/week/' + getToday())
          return
        }
        next('/week/' + store.getters.getDayViewDateString)
        return
      }
      if (!dh.isValidDate(to.params.day)) {
        next('/notfound')
        return
      }
      next()
    }
  },
  {
    path: '/month/:day?',
    name: 'Month',
    component: () => import('../views/month/MonthPage.vue'),
    beforeEnter: (to, from, next) => {
      if (!to.params.day) {
        if (!store.getters.getDayViewDateString) {
          next('/month/' + getToday())
          return
        }
        next('/month/' + store.getters.getDayViewDateString)
        return
      }
      if (!dh.isValidDate(to.params.day)) {
        next('/notfound')
        return
      }
      next()
    }
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/day/:day?',
    name: 'Day',
    component: () => import('../views/day/DayPage.vue'),
    beforeEnter: (to, from, next) => {
      if (!to.params.day) {
        if (!store.getters.getDayViewDateString) {
          next('/day/' + getToday())
          return
        }
        next('/day/' + store.getters.getDayViewDateString)
        return
      }
      if (!dh.isValidDate(to.params.day)) {
        next('/notfound')
        return
      }
      store.commit('setDayViewDateString', to.params.day)
      next()
    }
  },
  {
    path: '/eggform/:day?',
    name: 'EggForm',
    component: () => import('../views/eggform/EggFormPage.vue')
  },
  {
    path: '/editday/:day',
    name: 'EditDay',
    component: () => import('../views/day/DayPage.vue')
  },
  {
    path: '/total',
    name: 'Total',
    component: () => import('../views/total/TotalPage.vue')
  },
  {
    path: '*',
    name: 'notFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
