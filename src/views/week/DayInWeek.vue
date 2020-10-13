<template>
  <div
    class="day-in-week"
    :class="{
      'is-today': isToday,
      'is-holiday': isNotWorkingDay
    }"
    :tabindex="0"
    @click="onClick"
  >
    <div class="day-in-week-date">
      <div>{{ dayName }}</div>
      <div>{{ dayDisplay }}</div>
    </div>
    <div class="day-in-week-eggs">
      <template v-if="!eggCount">
        <div class="no-eggs">
          žádná vejce
        </div>
      </template>
      <template v-else>
        <div class="day-in-week-number-of-eggs">
          <div>{{ eggCount }}</div>
          <icon-base name="egg" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'DayInWeek',
  props: {
    day: { type: Date, required: true }
  },
  data () {
    return {

    }
  },
  computed: {
    dayName () {
      return dh.getDayName(this.day)
    },
    dateString () {
      return dh.getDateString(this.day)
    },
    dayDisplay () {
      return dh.formatDateFromObject (this.day, 'D. MMMMM YYYY')
    },
    eggKeys () {
      return this.$store.getters['eggs/getDayEggKeys'](this.dateString)
    },
    eggCount () {
      return Array.isArray(this.eggKeys) ? this.eggKeys.length : 0
    },
    isToday () {
      const today = new Date()
      return dh.getDateString(this.day) === dh.getDateString(today)
    },
    isNotWorkingDay () {
      return  dh.isWeekend(this.day) || dh.isHoliday(this.day)
    }
  },
  methods: {
    onClick () {
      this.$router.push('/day/' + this.dateString)
    }
  }
}
</script>
<style lang="stylus">
.day-in-week
  border: 1px solid var(--border-light)
  border-radius: var(--border-radius)
  padding: .25rem .75rem
  display: inline-flex
  justify-content: space-between
  flex: 1
  align-items: center
  cursor: pointer
  transition: all .3s ease-in-out
  align-self: stretch
  &:not(:first-child) 
    margin-top: 0.1rem
  &:focus
    outline: none
    box-shadow: var(--focus-shadow)
    &.is-holiday
      background: var(--primary300)
      &:hover
        background: var(--primary400)
    &.is-today
      background: var(--secondary300)
      &:hover 
        background: var(--secondary400)
    &:not(.is-today):not(.is-holiday) 
      background: #fff
      &:hover 
        background: #efefef

.day-in-week-date >*:first-child 
  font-weight: 600
  font-size: 1.2rem
  color: var(--text-color)
  font-style: italic

.day-in-week-date >*:last-child 
  color: var(--text-color)
  font-weight: 600
  font-size: 1.4rem
  white-space: nowrap

.day-in-week-eggs 
  flex: 0 0 auto
  display: flex
  justify-content: flex-end
  align-items: center
  & > .no-eggs
    color: var(--text-color)
    font-size: 1.2rem
    font-style: italic

.day-in-week-number-of-eggs 
  flex: 0 0 auto
  display: flex
  justify-content: flex-end
  align-items: center
  font-weight: 600
  & > *:first-child
    margin-right: .2re

</style>
