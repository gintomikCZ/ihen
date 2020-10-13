<template>
  <div v-if="!loading">
    <div class="container egg-form-title">
      <h3 class="view-title">
        nové vejce
      </h3>
    </div>
    <egg-form
      :form-initialized="formInitialized"
      @close-form="onCloseForm"
      @renew-form="renewForm"
      @initialized="formInitialized = false" />
  </div>
</template>
<script>
import EggForm from './EggForm.vue'
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'EggFormPage',
  props: {

  },
  data () {
    return {
      loading: true,
      dayString: null,
      formInitialized: false
    }
  },
  created () {
    this.dayString = this.$route.params.day || dh.formatDateFromObject(new Date(), 'YYYY-MM-DD')
    return this.$store.dispatch('eggForm/initializeForm', { day: this.dayString }).then(() => {
      this.loading = false
    })
  },
  components: {
    EggForm
  },
  methods: {
    onCloseForm (day) {
      this.$router.push('/day/' + day)
    },
    renewForm (day) {
      this.loading = true
      return this.$store.dispatch('eggForm/initializeForm', { day }).then(() => {
        this.loading = false
        this.formInitialized = true
      })
    }
  }
}
</script>
<style lang="stylus">
.egg-form-title {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
