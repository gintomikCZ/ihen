<template>
  <day-inner-edit
    v-if="!loading && editMode"
    :key="'daypageedit'"
    :day="day"
    :egg-count="eggCount"
    :group-par="groupPar"
    :egg-keys="eggKeys"
    :egg-groups="eggGroups"
  />
  <day-inner
    v-else-if="!loading && !editMode"
    :key="'daypage'"
    :day="day"
    :egg-count="eggCount"
    :group-par="groupPar"
    :egg-keys="eggKeys"
    :egg-groups="eggGroups"
  />
</template>
<script>
import DayInner from './DayInner.vue'
import DayInnerEdit from './DayInnerEdit.vue'
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'DayPage',
  data () {
    return {
      day: null,
      loading: true
    }
  },
  watch: {
    $route () {
      this.onRouteChange()
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (!to.params.day) {
      if (!this.$store.getters.getDayViewDateString) {
        const today = this.$store.getters.getTodayDateString
        this.$store.commit('setDayViewDateString', today)
        next('/day/' + today)
        return
      }
      next('/day/' + this.$store.getters.getDayViewDateString)
      return
    }
    if (!dh.isValidDate(to.params.day)) {
      next('/notfound')
      return
    }
    this.$store.commit('setDayViewDateString', to.params.day)
    next()
  },
  created () {
    this.onRouteChange()
  },
  computed: {
    editMode () {
      return this.$route.path.substr(1, 4) === 'edit'
    },
    dayDbFormat () {
      return !this.day ? '' : dh.formatDateFromObject(this.day, 'YYYY-MM-DD')
    },
    eggKeys () {
      return this.$store.getters['eggs/getDayEggKeys'](this.dayDbFormat)
    },
    width () {
      return this.$store.getters.getWidth
    },
    groupPar () {
      let par = 3
      if (this.width > 600) par = 5
      if (this.width > 900) par = 10
      return par
    },
    eggGroups () {
      if (!this.eggCount) return []
      const groups = []
      let group = []
      for (let i = 0; i < this.eggCount; i += 1) {
        group.push(this.eggKeys[i])
        if (group.length === this.groupPar) {
          groups.push(group)
          group = []
        }
        if (i === (this.eggCount - 1)) {
          groups.push(group)
        }
      }
      return groups
    },
    eggCount () {
      return Array.isArray(this.eggKeys) ? this.eggKeys.length : 0
    },
  },
  methods: {
    setDay () {
      this.day = new Date(this.$route.params.day)
    },
    onRouteChange () {
      this.loading = true
      this.setDay()
      return this.$store.dispatch('eggs/fetchDay', this.dayDbFormat).then(() => {
        this.loading = false
      })
    }
  },
  components: { DayInner, DayInnerEdit }
}
</script>
