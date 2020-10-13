<template>
  <div v-if="!loading">
    <title-row
      :title="'týden ' + mondayDisplay + ' - ' + sundayDisplay"
      @change-date="changeDate"
    />
    <div class="page-content container">
      <page-data
        :no-eggs="!eggCount"
        :rows="dataRows"
      />
      <div class="week-days">
        <day-in-week
          v-for="day in week"
          :key="getDateString(day)"
          :day="day"
        />
      </div>
    </div>
  </div>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
import DayInWeek from './DayInWeek.vue'
export default {
  name: 'WeekPage',
  props: {

  },
  created () {
    this.monday = dh.getMonday(this.$route.params.day)
    return this.$store.dispatch('eggs/fetchWeek', this.monday).then(() => {
      this.loading = false
    })
  },
  data () {
    return {
      monday: null,
      loading: true,
      pageIsOn: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (!to.params.day) {
      if (!this.$store.getters.getDayViewDateString) {
        const today = this.$store.getters.getTodayDateString
        this.$store.commit('setDayViewDateString', today)
        next('/week/' + today)
        return
      }
      next('/week/' + this.$store.getters.getDayViewDateString)
      return
    }
    if (!dh.isValidDate(to.params.day)) {
      next('/notfound')
      return
    }
    next()
  },
  watch: {
    $route () {
      console.log('route change')
      this.onRouteChange()
    }
  },
  computed: {
    dataRows () {
      if (!this.eggCount) return null
      const ar = [
        { label: 'počet vajec', value: this.eggCount.toLocaleString() },
        { label: 'váha celkem', value: this.totalWeight.toLocaleString() + 'g' }
      ]
      if (this.eggCount > 1) {
        ar.push(
          { label: 'průměrná váha vejce', value: this.avgWeight.toLocaleString() + 'g' }
        )
      }
      ar.push(
        { label: 'denní průměr (počet)', value: this.dayAvgNumber.toLocaleString() },
        { label: 'denní průměr (váha)', value: this.dayAvgWeight.toLocaleString() + 'g' }
      )
      return ar
    },

    week () {
      if (!this.monday) return []
      const week = []
      let time = this.monday.getTime()
      let dt
      do {
        week.push(new Date(time))
        if (week.length < 7) {
          dt = new Date(time)
          dt.setDate(dt.getDate() + 1)
          time = dt.getTime()
        }
      } while (week.length < 7)
      return week
    },
    mondayDisplay () {
      return this.week.length ? dh.formatDateFromObject(this.week[0], 'D.M.YYYY') : ''
    },
    sundayDisplay () {
      return this.week.length ? dh.formatDateFromObject(this.week[6], 'D.M.YYYY') : ''
    },
    weekEggKeys () {
      return this.$store.getters['eggs/getWeekEggKeys'](this.monday)
    },
    eggCount () {
      return Array.isArray(this.weekEggKeys) ? this.weekEggKeys.length : 0
    },
    totalWeight () {
      return !Array.isArray(this.weekEggKeys) ? 0 : this.weekEggKeys.reduce((acc, cur) => {
        return acc + this.$store.getters['eggs/getEgg'](cur).weight
      }, 0)
    },
    numberOfDays () {
      if (this.week.length !== 7) return 0
      const today = new Date()
      const todayTime = today.getTime()
      const monday = new Date(this.week[0].getFullYear(), this.week[0].getMonth(), this.week[0].getDate(), 0, 0, 0, 0)
      const sunday = new Date(this.week[6].getFullYear(), this.week[6].getMonth(), this.week[6].getDate(), 0, 0, 0, 0)
      return (todayTime >= monday.getTime()) && (todayTime < sunday.getTime()) ? today.getDay() : 7
    },
    avgWeight () {
      return !this.eggCount ? 0 : Math.round(this.totalWeight / this.eggCount)
    },
    dayAvgNumber () {
      return this.numberOfDays ? Math.round(100 * this.eggCount / this.numberOfDays) / 100 : 0
    },
    dayAvgWeight () {
      return this.numberOfDays ? Math.round(this.totalWeight / this.numberOfDays) : 0
    }
  },
  methods: {
    setMonday () {
      this.monday = dh.getMonday(this.$route.params.day)
    },
    onRouteChange () {
      this.loading = true
      this.setMonday()
      return this.$store.dispatch('eggs/fetchWeek', this.monday).then(() => {
        this.loading = false
      })
    },
    getDateString (day) {
      return dh.getDateString(day)
    },
    changeDate (par) {
      this.loading = true
      if (!this.monday) return
      let time = this.monday.getTime()
      const dt = new Date(time)
      const parr = par === 'plus' ? 7 : -7
      dt.setDate(dt.getDate() + parr)
      this.$router.push('/week/' + dh.getDateString(dt))
    }
  },
  components: { DayInWeek }
}
</script>
<style lang="stylus">
.week-days
  display: flex
  flex-direction: column
  padding-top: 1rem
  align-self: stretch
  max-width: 400px

@media only screen and (min-width: 550px) {
  .week-days {
    padding-top: 0;
  }
}
</style>