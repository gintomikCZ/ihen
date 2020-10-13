<template>
  <div v-if="!loading">
    <title-row
      title="souhrnné údaje"
      no-buttons
    />
    <div class="container total-data">
      <page-data
        :rows="dataRows"
        :no-eggs="!eggCount"
      />
    </div>
  </div>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'TotalPage',
  data () {
    return {
      loading: true
    }
  },
  computed: {
    dayAverageCount () {
      return this.numberOfDays ? Math.round((100 * this.eggCount) / this.numberOfDays) / 100 : 0
    },
    dayAverageWeight () {
      return this.numberOfDays ? Math.round(this.totalWeight / this.numberOfDays) : 0
    },
    numberOfDays () {
      if (!this.oldestDay) return 0
      const day = new Date(this.oldestDay)
      const today = new Date()
      return Math.round((today.getTime() - day.getTime()) / (24 * 1000 * 60 * 60))
    },
    oldestDay () {
      if (!this.eggCount) return ''
      return this.$store.getters['eggs/getOldestDay']
    },
    totalWeight () {
      return this.$store.getters['eggs/getTotalWeight']
    },
    eggCount () {
      return this.$store.getters['eggs/getTotalCount']
    },
    minEggDay () {
      const day = this.$store.getters['eggs/getMinEggDay']
      if (!day) return ''
      return dh.getStringFromDate(new Date(day), 'D.M.YYYY')
    },
    maxEggDay () {
      const day = this.$store.getters['eggs/getMaxEggDay']
      if (!day) return ''
      return dh.getStringFromDate(new Date(day), 'D.M.YYYY')
    },
    minEggWeight () {
      return this.$store.getters['eggs/getMinEggWeight']
    },
    maxEggWeight () {
      return this.$store.getters['eggs/getMaxEggWeight']
    },
    avgWeight () {
      return this.eggCount ? Math.round(this.totalWeight / this.eggCount) : 0
    },
    dataRows () {
      if (!this.eggCount) return null
      const ar = [
        { label: 'počet vajec', value: this.eggCount.toLocaleString() },
        { label: 'váha celkem', value: this.totalWeight.toLocaleString() + 'g' }
      ]
      if (this.eggCount > 1) {
        ar.push(
          { label: 'denní průměr (počet)', value: this.dayAverageCount.toLocaleString() },
          { label: 'denní průměr (váha)', value: this.dayAverageWeight.toLocaleString() + 'g' },
          { label: 'průměrná váha vejce', value: this.avgWeight.toLocaleString() + 'g' },
          { label: 'největší vejce', value: this.maxEggDay + ' - ' + this.maxEggWeight.toLocaleString() + 'g' },
          { label: 'nejmenší vejce', value: this.minEggDay + ' - ' + this.minEggWeight.toLocaleString() + 'g' }
        )
      }
      return ar
    },
  },
  created () {
    return this.$store.dispatch('eggs/fetchTotal', this.monday).then(() => {
      this.loading = false
    })
  }
}
</script>
<style lang="stylus">
.total-data {
  display: flex;

  & > * {
    flex: 1;
  }
}

@media only screen and (min-width: 550px) {
  .total-data {
    justify-content: center;
  }
}
</style>