<template>
  <transition
    name="grow-down"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
  >
    <t-scroll-container
      v-if="show"
      class="t-year-picker"
      :step="itemHeight"
      :options="years"
      :max-height="210"
      @scroll-up-end="addYearsAbove"
      @scroll-down-end="addYearsBelow"
    >
      <div
        class="p-2 bg-info-ultra-light"
        ref="scrollContainer"
      >
        <template v-for="year in years">
          <year-in-year-picker
            :current-year="currentYear"
            :year="year"
            :key="'yearpicker' + year"
            @click="onSelected"
          />
        </template>
      </div>
    </t-scroll-container>
  </transition>
</template>

<script>
import YearInYearPicker from './YearInYearPicker'
export default {
  name: 'TYearPicker',
  props: {
    currentYear: {
      type: Number, required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      years: [],
      itemHeight: 31,
      scrollContainer: null
    }
  },
  created () {
    this.resetYears()
  },
  watch: {
    show (nv) {
      if (nv) {
        this.resetYears()
      }
    }
  },
  methods: {
    resetYears () {
      const years = []
      let year = this.currentYear - 3
      const last = this.currentYear + 3
      do {
        years.push('' + year)
        year += 1
      } while (year <= last)
      this.years = years
    },
    onSelected (year) {
      this.$emit('selected', year)
    },
    afterEnter (el) {
      this.scrollContainer = el
      document.addEventListener('click', this.outsideClickHandler)
    },
    beforeLeave () {
      document.removeEventListener('click', this.outsideClickHandler)
    },
    addYearsAbove () {
      let year = parseInt(this.years[0], 10)
      for (let i = 0; i < 3; i += 1) {
        year -= 1
        this.years.unshift('' + year)
      }
    },
    addYearsBelow () {
      let year = parseInt(this.years[this.years.length - 1], 10)
      for (let i = 0; i < 3; i += 1) {
        year += 1
        this.years.push('' + year)
      }
    },
    outsideClickHandler (e) {
      if (this.scrollContainer.contains(e.target)) {
        e.preventDefault()
        e.stopPropagation()
        this.$emit('close-me')
      }
    }
  },
  components: { YearInYearPicker }
}
</script>
