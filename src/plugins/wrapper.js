export default {
  install (Vue) {
    Vue.prototype.$wrap = (el) => {
      const wrapper = document.getElementById('popupsWrapper')
      if (el) {
        wrapper.appendChild(el)
      }
    }
    Vue.prototype.$unwrap = (el) => {
      const wrapper = document.getElementById('popupsWrapper')
      if (el && wrapper.contains(el)) {
        wrapper.removeChild(el)
      }
    }
  }
}
