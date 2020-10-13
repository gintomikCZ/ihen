<template>
  <transition
    name="tslide-down"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
  >
    <t-scroll-container
      v-if="show"
      class="t-month-picker"
      :step="itemHeight"
      :options="monthOptions"
      ref="myScrollContainer"
    >
      <div>
        <template v-for="month in monthOptions">
          <month-in-month-picker
            :current-month="currentMonth"
            :month="month"
            :key="'monthpicker' + month.value"
            @click="onSelected"
          />
        </template>
      </div>
    </t-scroll-container>
  </transition>
</template>

<script>
import dh from '@/helpers/dateHelper.js'
import MonthInMonthPicker from './MonthInMonthPicker'
export default {
  name: 'TMonthPicker',
  props: {
    currentMonth: { type: Number, required: true },
    show: { type: Boolean, required: true }
  },
  computed: {
    monthOptions () {
      const ar = []
      for (let i = 0; i < 12; i += 1) {
        ar.push({ value: '' + i, label: dh.getMonthName(i) })
      }
      return ar
    }
  },
  data () {
    return {
      scrollContainer: '',
      itemHeight: 31
    }
  },
  methods: {
    onSelected (option) {
      this.$emit('selected', option)
    },
    afterEnter (el) {
      this.scrollContainer = el
      document.addEventListener('click', this.outsideClickHandler, true)
    },
    beforeLeave () {
      document.removeEventListener('click', this.outsideClickHandler, true)
    },
    outsideClickHandler (e) {
      if (!this.scrollContainer) return
      if (!this.scrollContainer.contains(e.target)) {
        e.preventDefault()
        e.stopPropagation()
        this.$emit('close-me')
      }
    }
  },
  components: { MonthInMonthPicker }
}
</script>
