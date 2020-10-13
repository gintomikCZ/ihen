import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TInput from './components/t-input/TInput.vue'
import TDatepicker from './components/tdatepicker/TDatepicker.vue'
import TPopover from './components/tpopover/TPopover.vue'
import IconBase from './components/icons/IconBase.vue'
import wrapper from './plugins/wrapper.js'
import CalendarArrow from './components/calendararrow/CalendarArrow.vue'
import TScrollContainer from './components/tscrollcontainer/TScrollContainer.vue'
import TBtn from './components/tbtn/TBtn.vue'
import TitleRow from './components/titlerow/TitleRow.vue'
import PageData from './components/page/PageData.vue'
Vue.use(wrapper)

const components = {
  TInput,
  TDatepicker,
  TitleRow,
  TPopover,
  IconBase,
  PageData,
  TScrollContainer,
  CalendarArrow,
  TBtn
}
Object.keys(components).forEach((item) => {
  Vue.component(item, components[item])
})

Vue.config.productionTip = false
Vue.config.errorHandler = (error) => {
  if (process.env.NODE_ENV === 'production') {
    return store.dispatch('error/displayError', '')
  }
  console.error(error)
  return store.dispatch('error/displayError', error.toString())
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
