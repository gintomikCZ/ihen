<template>
  <div class="t-dtp-day-wrap">
    <div
      tabindex="0"
      :class="classArray"
      @click="onClick"
    >
      {{ dayNumber }}
    </div>
  </div>
</template>

<script>
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'DayInDatepicker',
  props: {
    day: { validator: (v) => { return v instanceof Date }, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true }
  },
  computed: {
    classArray () {
      const ar = ['t-day-in-picker']
      ar.push(this.isSameMonth ? 'same-month' : 'different-month')
      if (this.isToday) ar.push('is-today')
      // ar.push(this.isSameMonth ? 'same-month' : 'not-same-month')
      // if (this.isToday) ar.push('color-today')
      else if (this.isWeekend || this.isHoliday) ar.push('is-holiday')
      // if (!this.isSameMonth) ar.push('not-same-month')
      return ar
    },
    todaysDateString () {
      return dh.getStringFromDate(new Date, 'YYYY-MM-DD')
    },
    dateString () {
      return dh.getStringFromDate(this.day, 'YYYY-MM-DD')
    },
    dayNumber () {
      return this.day.getDate()
    },
    isWeekend () {
      return [0, 6].indexOf(this.day.getDay()) > -1
    },
    isHoliday () {
      return dh.isHoliday(this.day)
    },
    isSameMonth () {
      return (this.day.getMonth() === this.month) && (this.day.getFullYear() === this.year)
    },
    isToday () {
      return this.dateString === this.todaysDateString
    }
  },
  methods: {
    onClick () {
      this.$emit('day-picked', this.day)
    }
  }
}
</script>
<style lang="stylus">
.t-day-in-picker
  align-items: center
  border-radius: var(--border-radius)
  background: #fff
  cursor: pointer
  display: flex
  justify-content: center
  line-height: 1
  flex: 1
  transition: all .3s ease-in-out
  color: var(--text-color)
  &:hover
    background: #efefef;
    color: var(--text-color-dark);
  &:focus
    outline: none;
    box-shadow: var(--focus-shadow);

.t-dtp-day-wrap
  flex: 0 0 44px
  padding: 3px
  display: flex
  align-self: stretch

.is-today
  background: var(--secondary200)
  color: var(--text-color-dark)

.is-holiday 
  background: var(--primary200)

.same-month 
  font-size: 1.5rem
  font-weight: 500

.different-month 
  color: var(--text-color-light)
  font-size: 1.2rem
  font-style: italic
  font-weight: 400

</style>
