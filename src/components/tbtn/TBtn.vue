<template>
  <component
    :is="componentName"
    :href="options.href || null"
    :button-type="buttonType"
    :color="color"
    :size="size"
    @click="onClick"
  >
    <div
      class="t-btn-icon"
      v-if="icon"
    >
      <icon-base
        :name="icon"
        :size="iconSize"
      />
    </div>
    <div
      v-if="label"
      class="t-btn-label"
    >
      {{ label }}
    </div>
  </component>
</template>
<script>
import TBtnWrapAnchor from './TBtnWrapAnchor.vue'
import TBtnWrapButton from './TBtnWrapButton.vue'
export default {
  name: 'TBtn',
  props: {
    options: {
      type: Object, required: true
    },
    color: {
      type: String, default: 'primary'
    }
  },
  data () {
    return {
      iconSizes: {
        small: 16,
        medium: 20,
        large: 24
      }
    }
  },
  computed: {
    componentName () {
      return 'href' in this.options ? 'TBtnWrapAnchor' : 'TBtnWrapButton'
    },
    buttonType () {
      return 'type' in this.options ? this.options.type : 'button'
    },
    icon () {
      return this.options.icon || ''
    },
    size () {
      return this.options.size || 'medium'
    },
    iconSize () {
      return this.iconSizes[this.size]
    },
    label () {
      return this.options.label || ''
    }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  },
  components: { TBtnWrapButton, TBtnWrapAnchor }
}
</script>
<style lang="stylus">
.t-btn
  border-radius: var(--border-radius)
  border: 1px solid var(--border)
  color: var(--text-color)
  cursor: pointer
  display: flex
  font-family: var(--font-family-text)
  font-weight: 500
  line-height: 1
  min-height: 44px
  min-width: 44px
  outline: none
  padding: 0
  text-decoration: none
  transition: all .3s ease-in-out
  white-space: nowrap
  &:hover:not(:focus)
    border: 1px solid var(--border)
    color: var(--text-color-dark)
  &:focus
    outline: none
    box-shadow: var(--focus-shadow)
  &.t-btn-primary 
    background: var(--primary300)
    &:hover:not(:focus)
      background: var(--primary400)
    &:focus
      background: var(--primary300)
      border: 1px solid var(--primary300)
  &.t-btn-secondary
    background: var(--secondary300)
    &:hover:not(:focus)
      background: var(--secondary400)
    &:focus
      background: var(--secondary300)
      border: 1px solid var(--secondary300)
  &.t-btn-small
    font-size: 1.4rem
  &.t-btn-medium 
    font-size: 1.6rem
  &.t-btn-large
    font-size: 1.8rem

.t-btn-icon, .t-btn-label
  flex: 0 0 auto
  display: flex
  justify-content: center
  align-items: center
  color: inherit
  align-self: stretch

.t-btn-icon
  min-width: 44px

.t-btn-label 
  padding-right: 0.75em
  &:first-child
    padding-left: 0.75em

</style>
