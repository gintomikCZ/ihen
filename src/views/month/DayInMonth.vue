<template>
  <div
    class="day-in-month"
    :class="{
      'not-this-month': !isThisMonth,
      'is-today': isToday,
      'is-holiday': isNotWorkingDay
    }"
    @click="onClick"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
  >
    <div class="day-number">
      <span>{{ dayNumber }}</span>
    </div>
    <transition
      name="tslide-down"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <div
        v-if="showTooltip"
        class="day-in-month-tooltip"
      >
        <template v-if="eggCount">
          <div class="day-in-month-tooltip-row">
            <span>počet vajec</span>
            <span>{{ eggCount }}</span>
          </div>
          <div class="day-in-month-tooltip-row">
            <span>váha</span>
            <span>{{ totalWeight + ' g' }}</span>
          </div>
        </template>
        <template v-else>
          <div class="tooltip-no-eggs">
            <span>žádná vejce</span>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'DayInMonth',
  props: {
      day: {
        type: Date,
        required: true
      },
      month: {
        type: Number,
        required: true
      },
      transitionLeave: {
        type: Boolean,
        required: true
      }
  },
  data () {
    return {
      hovered: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isThisMonth) this.$el.setAttribute('tabindex', '0')
    })
  },
  computed: {
    dayNumber () {
      return '' + this.day.getDate()
    },
    dateString () {
      return dh.getDateString(this.day)
    },
    isToday () {
      const today = new Date()
      return dh.getDateString(this.day) === dh.getDateString(today)
    },
    isNotWorkingDay () {
      return  dh.isWeekend(this.day) || dh.isHoliday(this.day)
    },
    isThisMonth () {
      return this.day.getMonth() === this.month
    },
    eggKeys () {
      return this.$store.getters['eggs/getDayEggKeys'](this.dateString)
    },
    eggCount () {
      return Array.isArray(this.eggKeys) ? this.eggKeys.length : 0
    },
    totalWeight () {
      return !Array.isArray(this.eggKeys) ? 0 : this.eggKeys.reduce((acc, cur) => {
        return acc + this.$store.getters['eggs/getEgg'](cur).weight
      }, 0)
    },
    showTooltip () {
      return this.hovered && !this.transitionLeave
    }
  },
  methods: {
    onClick () {
      this.$router.push('/day/' + this.dateString)
    },
    onMouseover () {
      this.hovered = true
    },
    onMouseout () {
      this.hovered = false
    },
    beforeLeave () {
      this.$emit('transition-leave-on')
    },
    afterLeave () {
      this.$emit('transition-leave-off')
    }

  }
}
</script>
<style lang="stylus">
.day-in-month
  position: relative
  display: inline-flex
  width: 44px
  height: 44px
  justify-content: center
  align-items: center
  border-radius: var(--border-radius)
  cursor: pointer
  margin: 0.1rem
  transition: all .3s ease-in-out
  &:not(:focus)
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15)
  &:focus
    outline: none
    box-shadow: var(--focus-shadow)
    transform: scale(.92)
  &.is-holiday:not(.not-this-month)
    background: var(--primary300)
    &:hover
      background: var(--primary400)
  &.is-today:not(.not-this-month)
    background: var(--secondary300)
    &:hover
      background: var(--today-hover-bg)
  &:not(.is-today):not(.is-holiday):not(.not-this-month)
    background: #fff
    &:hover
      background: #efefef
  &.not-this-month
    pointer-events: none
    opacity: 0.35
    background: rgba(0, 0, 0, 0.06 )


.day-number 
  font-weight: 600
  font-size: 1.6rem
  color: var(--text-color)


.day-in-month-tooltip 
  position: absolute
  bottom: calc(100% + 5px)
  left: -50px
  display: inline-block
  width: 15rem
  padding: .5rem .75rem
  font-size: 1.4rem
  font-weight: 500
  border-radius: var(--border-radius)
  z-index: 9
  background: #3a3a3a
  color: #ff

.day-in-month-tooltip-row 
  display: flex
  justify-content: space-between
  & > *:last-child 
    display: flex
    justify-content: flex-end

.tooltip-no-eggs 
  display: flex
  justify-content: center
  align-items: cener;

</style>