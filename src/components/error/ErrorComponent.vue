<template>
  <transition name="tfade">
    <div
      class="error-dialog"
      v-if="error"
    >
      <div class="error-title">
        <icon-base
          name="exclamationTriangle"
          size="24"
        />
        {{ title }}
      </div>
      <div class="error-body">
        <div v-if="production">
          <div>Něco se nepodařilo a iHen je z toho celá nesvá.</div>
          <div>Kliknutím na tlačítko níže ji vrátíte zpět na úvod.</div>
        </div>
        <div v-else>
          {{ errorString }}
        </div>
      </div>
      <div class="error-footer">
        <t-btn
          :options="{
            label: 'OK'
          }"
          color="secondary"
          @click="onClick"
        />
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'ErrorComponent',
  data () {
    return {
      title: 'chyba'
    }
  },
  computed: {
    errorString () {
      return this.$store.getters['error/getErrorString']
    },
    production () {
      return process.env.NODE_ENV === 'production'
    },
    error () {
      return this.$store.getters['error/getError']
    }
  },
  methods: {
    onClick () {
      return this.$store.dispatch('error/unsetError').then(() => {
        if (this.production) {
          this.$router.push('/')
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.error-dialog
  background: var(--primary100)
  border-radius: var(--border-radius)
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.2)
  border: 3px solid var(--primary400)
  display: flex
  flex-direction: column
  left: 50%
  max-height: 90vh
  max-width: 90vw
  min-width: 25rem
  overflow-y: auto
  padding: 2rem
  position: fixed
  top: 50%
  z-index: 99
  transform: translate(-50%, -50%)

.error-title
  border-bottom: 1px solid var(--text-color-light)
  color: var(--text-color-dark)
  font-family: var(--font-family-headers)
  font-size: 2rem
  font-weight: 700
  padding: 0 0 2rem
  display: flex
  align-items: center
  & > *:first-child
    margin-right: 1rem

.error-body
  border-bottom: 1px solid var(--text-color-light)
  color: var(--text-color)
  flex: 1
  font-family: var(--font-family-text)
  font-size: 1.6rem
  font-weight: 500
  padding: 3rem 0
  & > div
    text-align: center
    line-height: 1.5

.error-footer
  display: flex
  flex: 0 0 auto
  justify-content: center
  padding: 3rem 0 1rem

</style>
