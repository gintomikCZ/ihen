<template>
  <div class="egg-cell">
    <div class="egg-index">
      {{ index + 1 }}
    </div>
    <div class="egg-weight">
      <span>{{ weight }}</span>
      <span>g</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EggCell',
  props: {
    eggId: { type: String, required: true },
    index: { type: Number, required: true }
  },
  data () {
    return {

    }
  },
  computed: {
    egg () {
      return this.$store.getters['eggs/getEgg'](this.eggId)
    },
    weight () {
      return !this.egg ? '' : this.egg.weight
    }
  },
  methods: {
  }
}
</script>
