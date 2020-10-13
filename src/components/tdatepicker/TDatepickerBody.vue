<template>
  <t-popover
    :horizontal-offset="-10"
    :vertical-offset="10"
    :target-id="inputId"
    :show="showPicker"
    @close-me="$emit('close-me')"
    @hide="$emit('hide')"
    @show="$emit('show')"
  >
    <div
      ref="myDiv"
      class="t-dtp"
    >
      <!-- header -->
      <div class="t-dtp-header">
        <t-datepicker-arrow
          direction="left"
          double
          @click="yearMinus"
        />
        <t-datepicker-arrow
          direction="left"
          @click="monthMinus"
        />
        <div class="t-dtp-hoverable-outer header-month">
          <div
            tabindex="0"
            class="t-dtp-hoverable"
            :id="monthButtonId" 
            @click="$emit('show-months')"
          >
            {{ monthName }}
          </div>
        </div>
        <t-month-picker
          :show="showMonthPicker"
          :current-month="month"
          @selected="onMonthPicked"
          @close-me="$emit('close-months')"
        />
        <div class="t-dtp-hoverable-outer header-year">
          <div
            tabindex="0"
            class="t-dtp-hoverable"
            :id="yearButtonId"
            @click="$emit('show-years')"
          >
            {{ year }}
          </div>
        </div>
        <t-year-picker
          :current-year="year"
          :show="showYearPicker"
          @close-me="$emit('close-years')"
          @selected="onYearPicked"
        />
        <t-datepicker-arrow
          direction="right"
          @click="monthPlus"
        />
        <t-datepicker-arrow
          direction="right"
          double
          @click="yearPlus"
        />
      </div>
      <!-- header end -->

      <!-- body -->
      <div class="t-dtp-body">
        <div class="t-dtp-daynames-row">
          <div
            v-for="dayName in dayNames"
            class="t-dtp-daynames-row-item"
            :class="{
              'text-primary-dark': ['so', 'ne'].indexOf(dayName) > -1
            }"
            :key="dayName"
          >
            {{ dayName }}
          </div>
        </div>
        <transition
          appear
          :name="weeksTransitionName"
          @before-leave="transitionWeeksOn=true"
          @after-leave="transitionWeeksOn=false"
        >
          <div
            class="t-weeks-wrap"
            v-if="showWeeksComputed"
          >
            <div
              v-for="(week, index) in weeks"
              class="t-dtp-week-row"
              :key="'week' + index"
            >
              <day-in-datepicker
                v-for="(day, index2) in week"
                :key="'weekday' + index2"
                :day="day"
                :month="month"
                :year="year"
                @day-picked="onDayPicked"
              />
            </div>
          </div>
        </transition>
      </div>
      <!-- body end -->
    </div>
  </t-popover>
</template>

<script>
import dh from '@/helpers/dateHelper.js'
import { getUniqueId } from '@/helpers/helper.js'
import DayInDatepicker from './DayInDatepicker.vue'
import TDatepickerArrow from './TDatepickerArrow.vue'
import TMonthPicker from './TMonthPicker.vue'
import TYearPicker from './TYearPicker.vue'
export default {
  name: 'TDatepickerBody',
  props: {
    date: {
      validator: (v) => {
        return (v instanceof Date) && !isNaN(v.valueOf())
      },
      required: true
    },
    showPicker: { type: Boolean, required: true },
    showMonthPicker: { type: Boolean, required: true },
    showYearPicker: { type: Boolean, required: true },
    inputId: { type: String, required: true }
  },
  data () {
    return {
      month: null,
      year: null,
      weeks: [],
      monthButtonId: getUniqueId(),
      yearButtonId: getUniqueId(),
      showWeeks: false,
      transitionWeeksOn: false,
      weeksTransitionName: 'tslide-right'
    }
  },
  watch: {
    month () {
      this.getWeeks()
    },
    year () {
      this.getWeeks()
    },
    date () {
      this.getMonthAndYear()
    }
  },
  computed: {
    dayNames () {
      return dh.getDayNames(true)
    },
    monthName () {
      return dh.getMonthName(this.month)
    },
    showWeeksComputed () {
      return this.showWeeks && !this.transitionWeeksOn
    }
  },
  created () {
    this.getMonthAndYear()
  },
  mounted () {
    this.showWeeks = true
  },
  methods: {
    getMonthAndYear () {
      const dt = dh.isValidDate(this.date) ? this.date : new Date()
      this.month = dt.getMonth()
      this.year = dt.getFullYear()
    },
    getWeeks () {
      return Promise.resolve().then(() => {
        this.showWeeks = false
      }).then(() => {
        const dt = new Date(this.year, this.month, 1)
        const weeks = []
        const monday = dh.getMonday(dt)
        do {
          const week = dh.getWeekDates(monday)
          weeks.push(week)
          monday.setDate(monday.getDate() + 7)
        } while ((monday.getMonth() <= this.month && monday.getFullYear() <= this.year))
        this.weeks = weeks
      }).then(() => {
        this.showWeeks = true
      })
    },
    onDayPicked (dt) {
      this.$emit('day-picked', dt)
    },
    monthPlus () {
      this.weeksTransitionName = 'tslide-right'
      if (this.month === 11) {
        this.year += 1
        this.month = 0
        return
      }
      this.month += 1
    },
    monthMinus () {
      this.weeksTransitionName = 'tslide-left'
      if (this.month === 0) {
        this.year -= 1
        this.month = 11
        return
      }
      this.month -= 1
    },
    yearPlus () {
      this.weeksTransitionName = 'tslide-right'
      this.year += 1
    },
    yearMinus () {
      this.weeksTransitionName = 'tslide-left'
      this.year -= 1
    },
    onYearPicked (year) {
      this.year = parseInt(year, 10)
      this.$emit('close-years')
    },
    onMonthPicked (option) {
      this.month = parseInt(option.value, 10)
      this.$emit('close-months')
    }
  },
  components: { TYearPicker, DayInDatepicker, TMonthPicker, TDatepickerArrow }
}
</script>
<style lang="stylus">
.t-dtp
  display: inline-flex
  flex-direction: column
  border-radius: var(--border-radius)
  overflow: hidden
  width: 308px
  height: 340px
  box-shadow: 0 3px 8px rgba(0, 0, 0, .45)

.t-dtp-header 
  flex: 0 0 44px
  display: flex

.t-dtp-hoverable-outer 
  background: var(--accent-light)
  display:flex
  padding: 4px
  &:not(.header-month):not(.header-year)
    flex: 0 0 44px
  &.header-month
    flex: 0 0 78px
  &.header-year
    flex: 0 0 54px

.t-dtp-hoverable
  flex: 1
  display: flex
  border-radius: var(--border-radius)
  align-items: center
  justify-content: center
  cursor: pointer
  font-size: 1rem
  font-weight: 600
  color: var(--text-color)
  background: var(--accent-light)
  &:hover
    background: var(--accent-ultra-light)
  &:focus
    outline: none
    box-shadow: var(--focus-shadow)
.header-month
  position: relative

.t-year-picker, .t-month-picker
  position: absolute
  top: 5px
  left: 100px
  box-shadow: 0 3px 8px rgba(0, 0, 0, .45)
  min-width: 100px
  border-radius: var(--border-radius)
  background: #efefef;
  opacity: 1
.t-dtp-daynames-row
  flex: 0 0 32px
  display: flex
  background: #e9e9e9
  color: var(--text-color-dark)
  border-bottom: 2px solid transparent
.t-dtp-daynames-row-item
  display: flex
  justify-content: center
  align-items: center
  font-size: 1rem
  border: 0
  font-weight: 600
  flex: 0 0 44px
.t-dtp-week-row
  display: flex
  flex: 0 0 44px
  background: #e8e8e8
.t-dtp-body, .t-weeks-wrap
  flex: 1
  display: flex
  flex-direction: column

.month-picker-item-outer
  flex: 0 0 44px
  padding: 4px
  display: flex
  border-top: 1px solid var(--border-light)
  background: #efefef
  &:first-child
    border-top-color: transparent
    
.month-picker-item
  flex: 1
  font-size: 0.9rem
  font-weight: 600
  display: flex
  justify-content: center
  align-items: center
  border-radius: var(--border-radius)
  transition: all .3s
  &:not(.month-picker-item-active)
    cursor: pointer
  &:not(.month-picker-item-active):hover:not(:focus)
    background: var(--accent-ultra-light)
    z-index: 9
  &:not(.month-picker-item-active):hover + .month-picker-item
    border-top: 1px solid transparent
  &:focus
    box-shadow: var(--focus-shadow)
    z-index: 9
    
.month-picker-item-active
  background: var(--accent)
  border-top: 1px solid transparent
  cursor: default

</style>
