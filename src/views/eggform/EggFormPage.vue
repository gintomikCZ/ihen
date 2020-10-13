<template>
  <page-wrap>
    <t-loading v-if="loading" />
    <template v-else>
      <div class="container egg-form-title">
        <h3 class="view-title">
          nové vejce
        </h3>
      </div>
      <egg-form @close-form="onCloseForm" />
    </template>
  </page-wrap>
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
      dayString: null
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
    }
  }
}
</script>
<style lang="stylus">

.egg-form-title
  text-align: center
  margin-bottom: 1rem;
  
</style>
