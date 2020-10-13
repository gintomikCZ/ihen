<template>
  <div v-if="!loading">
    <title-row
      :title="monthDisplay"
      @change-date="changeDate"
    />
    <div class="month-page-content container">
      <page-data
        :rows="dataRows"
        :no-eggs="!eggCount"
      />
      <div class="month-view">
        <template v-for="(week, index) in weeks">
          <div
            class="week-in-month"
            :key="'week' + index"
          >
            <day-in-month
              v-for="day in week"
              :key="getDateString(day)"
              :transition-leave="transitionLeave"
              :day="day"
              :month="month"
              @transition-leave-off="transitionLeave=false"
              @transition-leave-on="transitionLeave=true"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
import DayInMonth from './DayInMonth.vue'
export default {
  name: 'MonthPage',
  created () {
    this.onRouteChange()
  },
  data () {
    return {
      month: null,
      year: null,
      loading: true,
      transitionLeave: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (!to.params.day) {
      if (!this.$store.getters.getDayViewDateString) {
        const today = this.$store.getters.getTodayDateString
        this.$store.commit('setDayViewDateString', today)
        next('/month/' + today)
        return
      }
      next('/month/' + this.$store.getters.getDayViewDateString)
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
      this.onRouteChange()
    }
  },
  computed: {
    dataRows () {
      if (!this.eggCount) return []
      console.log(this.totalWeight)
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
    days () {
      if (this.month === null || this.year === null) return []
      const days = []
      const numberOfDays = dh.getNumberOfDays(this.month, this.year)
      for (let i = 1; i <= numberOfDays; i += 1) {
        days.push(new Date(this.year, this.month, i))
      }
      let first = days[0].getDay()
      let firstTime
      let dt
      if (first === 0) first = 7
      for (let i = 1; i < first; i += 1) {
        firstTime = days[0].getTime()
        dt = new Date(firstTime)
        dt.setDate(dt.getDate() - i)
        days.unshift(new Date(dt.getTime()))
      }
      let last = days[days.length - 1].getDay()
      let lastTime
      if (last === 0) return days
      do {
        lastTime = days[days.length - 1].getTime()
        dt = new Date(lastTime)
        dt.setDate(dt.getDate() + 1)
        days.push(new Date(dt.getTime()))
      } while (days[days.length - 1].getDay() !== 0)
      return days
    },
    weeks () {
      if (!this.days.length) return []
      let weeks = []
      let week = []
      for (let i = 0; i < this.days.length; i += 1) {
        week.push(this.days[i])
        if (week.length === 7) {
          weeks.push(week)
          week = []
        }
      }
      return weeks
    },
    monthDisplay () {
      return this.month === null || this.year === null ? '' : dh.getMonthName(this.month) + ' ' + this.year
    },
    eggKeys () {
      return this.$store.getters['eggs/getMonthEggKeys'](this.month, this.year)
    },
    eggCount () {
      return Array.isArray(this.eggKeys) ? this.eggKeys.length : 0
    },
    totalWeight () {
      return !Array.isArray(this.eggKeys) ? 0 : this.eggKeys.reduce((acc, cur) => {
        return acc + this.$store.getters['eggs/getEgg'](cur).weight
      }, 0)
    },
    avgWeight () {
      return !this.eggCount ? 0 : Math.round(this.totalWeight / this.eggCount)
    },
    numberOfDays () {
      if (this.month === null || this.year === null) return 0
      const today = new Date()
      if ((this.month === today.getMonth()) && (this.year === today.getFullYear())) {
        return today.getDate()
      }
      return dh.getNumberOfDays(this.month, this.year)
    },
    dayAvgNumber () {
      return !this.numberOfDays ? 0 : Math.round(100 * this.eggCount / this.numberOfDays) / 100
    },
    dayAvgWeight () {
      return !this.numberOfDays ? 0 : Math.round(this.totalWeight / this.numberOfDays)
    }
  },
  methods: {
    setMonth () {
      const dt = new Date(this.$route.params.day)
      this.month = dt.getMonth()
      this.year = dt.getFullYear()
    },
    onRouteChange () {
      this.loading = true
      this.setMonth()
      return this.$store.dispatch('eggs/fetchMonth', { month: this.month, year: this.year }).then(() => {
        this.loading = false
      })
    },
    getDateString (day) {
      return dh.getDateString(day)
    },
    changeDate (par) {
      let year = this.year
      let month = par === 'plus' ? this.month + 1 : this.month - 1
      if (month === 12) {
        month = 0
        year += 1
      }
      if (month === -1) {
        month = 11
        year -= 1
      }
      this.$router.push('/month/' + dh.getDateString(new Date(year, month, 1)))
    }
  },
  components: { DayInMonth }
}
</script>
<style lang="stylus">
.month-view {
  align-self: center;
  margin-top: 1rem;

  & > div {
    display: flex;
    flex-wrap: no-wrap;
  }
}

@media only screen and (min-width: 700px) {
  .month-view {
    margin-top: 0;
  }
}
</style>
