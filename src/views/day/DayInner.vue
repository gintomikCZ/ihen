<template>
  <div>
    <title-row
      :title="dayDisplayFormat"
      @change-date="changeDate"
    />
    <div class="container page-content">
      <page-data
        :no-eggs="!eggCount"
        :rows="dataRows"
      />
      <div class="page-buttons">
        <t-btn :options="addEggButton" />
        <t-btn
          v-if="eggCount"
          :options="editButton"
        />
      </div>
    </div>
    <div
      class="container page-eggs"
      v-if="!noEggs"
    >
      <div
        class="egg-group"
        v-for="(group, index) in eggGroups"
        :key="'group' + index"
      >
        <template v-for="(eggId, index2) in group">
          <egg-cell
            :egg-id="eggId"
            :key="'dayView' + eggId"
            :index="(index * groupPar) + index2"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import EggCell from './EggCell.vue'
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'DayInner',
  props: {
    day: { type: Date, required: true },
    eggKeys: { type: Array, required: true },
    eggGroups: { type: Array, required: true },
    groupPar: { type: Number, required: true },
    eggCount: { type: Number, required: true }
  },
  computed: {
    dataRows () {
      if (!this.eggCount) return null
      const ar = [
        { label: 'počet vajec', value: this.eggCount + '' },
        { label: 'váha celkem', value: this.totalWeight + 'g' }
      ]
      if (this.eggCount > 1) ar.push(
        { label: 'průměrná váha', value: this.avgWeight + 'g' }
      )
      return ar
    },
    dayDisplayFormat () {
      return !this.day ? '' : dh.formatDateFromObject(this.day, 'DDD. MMMMM YYYY')
    },
    dayDbFormat () {
      return !this.day ? '' : dh.formatDateFromObject(this.day, 'YYYY-MM-DD')
    },
    totalWeight () {
      return !Array.isArray(this.eggKeys) ? 0 : this.eggKeys.reduce((acc, cur) => {
        return acc + this.$store.getters['eggs/getEgg'](cur).weight
      }, 0)
    },
    avgWeight () {
      return !this.eggCount ? 0 : Math.round(this.totalWeight / this.eggCount)
    },
    addEggButton () {
      return {
        href: '/eggform/' + this.dayDbFormat,
        label: 'přidat vejce',
        icon: 'egg'
      }
    },
    editButton () {
      return {
        label: 'upravit',
        icon: 'edit',
        href: '/editday/' + this.dayDbFormat
      }
    },
    noEggs () {
      return this.eggCount === 0
    }
  },
  methods: {
    changeDate (par) {
      const time = this.day.valueOf()
      const dt = new Date(time)
      if (par === 'minus') {
        dt.setDate(dt.getDate() - 1)
      } else {
        dt.setDate(dt.getDate() + 1)
      }
      const str = dh.formatDateFromObject(dt, 'YYYY-MM-DD')
      this.$router.push('/day/' + str)
    }
  },
  components: { EggCell }
}
</script>
