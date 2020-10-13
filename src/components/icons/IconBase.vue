<template>
  <svg
    class="tvl-icon-base"
    xmlns="http://www.w3.org/2000/svg"
    :height="size"
    :width="size"
    :viewBox="viewBox"
  >
    <g :fill="colorComputed">
      <path
        v-for="(path, index) in iconPathComputed"
        :key="'iconPath' + name + index"
        :d="path"
      />
    </g>
  </svg>
</template>
  <script>
import { getIconPath, getIconViewBox } from './iconHelper.js'
export default {
  name: 'IconBase',
  props: {
    size: { type: [Number, String], default: 16 },
    name: { type: String, required: true },
    color: { type: String, default: '' }
  },
  computed: {
    iconPath () {
      return getIconPath(this.name)
    },
    viewBox () {
      return getIconViewBox(this.name)
    },
    iconPathComputed () {
      return (typeof this.iconPath === 'string') ? [this.iconPath] : this.iconPath
    },
    colorComputed () {
      if (!this.color) return 'currentColor'
      return this.color.charAt(0) === '#' ? this.color : ('var(--' + this.color + ')')
    }
  },
  mounted () {
    if (!this.iconPath) throw new Error('icon name' + this.name + 'not found')
  }
}
</script>
<style lang="stylus">
.tvl-icon-base
  transition: all 0.3s ease-in-out;
</style>