import Vue from 'vue'
import validator from '../../helpers/validator.js'
import db from '../../helpers/db.js'
const pp = Promise.resolve()

export default {
  namespaced: true,
  state: {
    formError: false,
    formErrorMessage: '',
    status: '',
    submited: false,
    controls: {
      day: {
        error: false,
        errorMessage: '',
        value: '',
        initialValue: '',
        type: 'date'
      },
      weight: {
        error: false,
        errorMessage: '',
        value: null,
        initialValue: '',
        type: 'number'
      }
    },
    valRules: {
      weight: {
        required: { message: 'Zadejte váhu vejce, prosím.' },
        numeric: { message: 'Je požadována číselná hodnota.' },
        maxValue: { message: 'Hodnota nemůže přesáhnout 150g.', param: 150 },
        minValue: { message: 'Hodnota nemůže být nižší než 20g', param: 20 }
      },
      day: {
        required: { message: 'Datum je třeba uvést.' },
        isValidDate: { message: 'Datum není platné.' }
      }
    },
    editedRecord: {
      day: null,
      weight: null,
      id: null
    }
  },
  getters: {
    getControlValue: state => control => {
      return state.controls[control].value
    },
    getControlErrorMessage: state => (control) => state.controls[control].errorMessage,
    getControlError: state => (control) => state.controls[control].error,
    getValidationResult: state => {
      return !state.formError && Object.keys(state.controls).reduce((acc, cur) => {
        return acc && !state.controls[cur].error
      }, true)
    },
    getFormError: state => state.formError,
    getFormErrorMessage: state => state.formErrorMessage,
    getFormData: state => {
      return Object.keys(state.controls).reduce((acc, cur) => {
        Vue.set(acc, cur, state.controls[cur].value)
        return acc
      }, {})
    },
    getControlInitialValue: state => (control) => state.controls[control].initialValue,
    getControlIsChanged: state => (control) => state.controls[control].initialValue !== state.controls[control].value,
    getIsChanged: state => {
      return Object.keys(state.controls).reduce((acc, cur) => {
        return acc || state.controls[cur].initialValue !== state.controls[cur].value
      }, false)
    },
    getIsSubmited: state => state.submited,
    getControlValidationRules: state => (control) => state.valRules[control]
  },
  mutations: {
    setControlValue (state, payload) {
      state.controls[payload.control].value = payload.value
    },
    setControlError (state, payload) {
      state.controls[payload.control].error = payload.value
    },
    setControlErrorMessage (state, payload) {
      state.controls[payload.control].errorMessage = payload.value
    },
    makeControlValid (state, control) {
      state.controls[control].error = false
      state.controls[control].errorMesssage = ''
    },
    makeControlInvalid (state, payload) {
      state.controls[payload.control].error = true
      state.controls[payload.control].errorMessage = payload.message
    },
    setSubmited (state, value) {
      state.submited = value
    },
    resetForm (state) {
      state.formError = false
      state.formErrorMessage = ''
      state.submited = false
      state.status = null
      Object.keys(state.controls).forEach(control => {
        state.controls[control].error = false
        state.controls[control].errorMessage = ''
        state.controls[control].value = null
        state.controls[control].initialValue = null
      })
    },
    setControlInitialValue (state, payload) {
      state.controls[payload.control].initialValue = payload.value
    },
    setFormError (state, value) {
      state.formError = value
    },
    setFormErrorMessage (state, value) {
      state.formErrorMessage = value
    }
  },
  actions: {
    initializeForm (context, payload) {
      return pp.then(() => {
        context.commit('resetForm')
      }).then(() => {
        Object.keys(context.state.controls).forEach(control => {
          if (control in payload) {
            context.commit('setControlInitialValue', { control, value: payload[control] })
            context.commit('setControlValue', { control, value: payload[control] })
          }
        })
      })
    },
    validateControl (context, control) {
      const value = context.state.controls[control].value
      if (!context.state.valRules[control]) {
        return pp.then(() => context.commit('makeControlValid', { control }))
      }
      const keys = Object.keys(context.state.valRules[control])
      const len = keys.length
      let valid = true
      let message = ''
      for (let i = 0; i < len; i += 1) {
        if (valid) {
          const result = ('param' in context.state.valRules[control][keys[i]])
            ? validator[keys[i]](value, context.state.valRules[control][keys[i]].param)
            : validator[keys[i]](value)
          if (!result) {
            valid = false
            message = context.state.valRules[control][keys[i]].message
          }
        }
      }
      if (valid) {
        return pp.then(() => { context.commit('makeControlValid', control) })
      }
      return pp.then(() => { context.commit('makeControlInvalid', { control, message }) })
    },
    onControlFocus (context, control) {
      if (!context.state.submited) {
        return pp.then(() => { context.commit('makeControlValid', control) })
      }
      return Promise.all(
        Object.keys(context.state.controls).map(control => {
          return pp.then(() => { context.commit('makeControlValid', { control }) })
        }).concat([
          pp.then(() => { context.commit('setSubmited', false) }),
          pp.then(() => { context.commit('setFormError', false) }),
          pp.then(() => { context.commit('setFormErrorMessage', '') })
        ])
      )
    },
    onSubmit (context) {
      if (context.state.submited) return
      context.commit('setSubmited', true)
      return context.dispatch('validateForm').then(() => {
        if (context.getters['getValidationResult']) {
          return context.dispatch('saveData')
        }
      })
    },
    saveData (context) {
      const data = {}
      Object.keys(context.state.controls).forEach(control => {
        let value = context.state.controls[control].value
        if (['number', 'date', 'time'].indexOf(context.state.controls[control].type) > -1 && value === '') {
          value = null
        }
        Vue.set(data, control, value)
      })
      return db.post('eggs', data)
    },
    validateForm (context) {
      return Promise.all(
        Object.keys(context.state.controls).map((control) => {
          return context.dispatch('validateControl', control)
        })
      )
    },
    cleanUp (context, formId) {
      return pp.then(() => {
        context.commit('unsetForm', formId)
      })
    },
    handleServerValidation (context, data) {
      let formError = false
      Object.keys(data.data).forEach(control => {
        if (control in context.state.controls) {
          if (data.data[control].valid) {
            context.commit('makeControlValid', { control })
          } else {
            context.commit('makeControlInvalid', { control, message: data.data[control].message })
          }
          return
        }
        if (!data.data[control].valid && !formError) {
          context.commit('setFormError', { value: true })
          context.commit('setFormErrorMessage', { value: data.data[control].message })
          formError = true
        }
      })
      if (!formError) {
        context.commit('setFormError', false)
        context.commit('setFormErrorMessage', '')
      }
    }
  }
}
