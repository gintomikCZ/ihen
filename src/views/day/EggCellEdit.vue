<template>
  <div
    class="egg-cell egg-cell-edit"
    @click="onEditWeightClick"
    tabindex="0"
  >
    <button
      type="button"
      class="delete-icon"
      @click="onDeleteButtonClick"
      tabindex="0"
    >
      <icon-base
        name="timesSquare"
        :size="20"
      />
    </button>
    <div class="egg-index egg-index-edit">
      {{ index + 1 }}
    </div>
    <div
      class="egg-weight"
    >
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
    onDeleteButtonClick () {
      this.$emit('deletion-requested', this.eggId)
    },
    onEditWeightClick () {
      this.$emit('edit-requested', this.eggId)
    }
  },

}
</script>
<style lang="stylus">
.egg-cell-edit
  cursor: pointer
  min-width: 76px
  min-height: 114px
  align-items: center
  flex-direction: column
  border: 1px solid var(--border)
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%
  margin-right: 4px
  transition: all .3s ease-in-out
  &:hover
    background: var(--primary300)
  &:focus
    outline: none
    box-shadow: var(--focus-shadow)
  &:last-child
    margin-right: 0

.egg-index-edit
  display: flex
  justify-content: center
  align-items: flex-end
  background: transparent

.delete-icon
  align-items: center
  background: var(--secondary-btn-bg)
  border-radius: var(--border-radius)
  border: 1px solid var(--secondary-btn-border)
  color: var(--secondary-btn-text)
  cursor: pointer
  display: flex
  flex: 0 0 33px
  justify-content: center
  min-width: 33px
  transtion: all .3s ease-in-out
  &:hover
    background: var(--secondary300)
  &:focus
    outline: none
    box-shadow: var(--focus-shadow)
</style>
