import { baseUrl, getToken } from './constants.js'

import axios from 'axios'
import router from '../router/index.js'
import store from '../store/index.js'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: 'json, application/json',
    Authorization: 'bearer ' + getToken()
  }
})

export default {
  get (path) {
    return axiosInstance({ method: 'get', url: path }).then((response) => {
      return Promise.resolve(response.data.data)
    }).catch((error) => {
      if (error.response && error.response.status === 404) return router.push('/error404')
      return this.handleError(error)
    })
  },
  post (path, data) {
    store.commit('setLastHttpStatus', null, { root: true })
    return axiosInstance({ method: 'post', url: path, data }).then((response) => {
      store.commit('setLastHttpStatus', response.status, { root: true })
      return Promise.resolve(response.data.data)
    }).catch((error) => {
      console.log(error)
      store.commit('setLastHttpStatus', error.response.status, { root: true })
      if (error.response && error.response.status === 404) return router.push('/notfound')
      return this.handleError(error)
    })
  },
  put (path, data) {
    store.commit('setLastHttpStatus', null, { root: true })
    return axiosInstance({ method: 'put', url: path, data }).then((response) => {
      store.commit('setLastHttpStatus', response.status, { root: true })
      return Promise.resolve(response.data.data)
    }).catch((error) => {
      store.commit('setLastHttpStatus', error.response.status, { root: true })
      if (error.response && error.response.status === 404) return router.push('/notfound')
      return this.handleError(error)
    })
  },
  delete (path, data) {
    return axiosInstance({ method: 'delete', url: path, data }).then((response) => {
      return Promise.resolve(response.data.data)
    }).catch((error) => {
      if (error.response && error.response.status === 404) return router.push('/notfound')
      return this.handleError(error)
    })
  },
  handleError (error) {
    console.log(error)
    store.dispatch('error/displayError', ((typeof error === 'object') && (error !== null) && ('toJSON' in error)) ? error.toJSON() : JSON.stringify(error))
  }
}
