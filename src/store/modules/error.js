export default {
  namespaced: true,
  state: {
    errorString: '',
    error: false
  },
  getters: {
    getError: state => state.error,
    getErrorString: state => state.errorString || 'unknown error'
  },
  mutations: {
    setErrorString (state, str) {
      state.errorString = str
    },
    setError (state, val) {
      state.error = val
    }
  },
  actions: {
    displayError (context, error) {
      return Promise.resolve().then(() => {
        context.commit('setErrorString', error)
        context.commit('setError', true)
      })
    },
    unsetError (context) {
      return Promise.resolve().then(() => {
        context.commit('setErrorString', '')
        context.commit('setError', false)
      })
    }
  }
}