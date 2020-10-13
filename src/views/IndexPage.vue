<template>
  <div class="page-wrap">
    <div class="container text-center index-page-text">
      elektronická
    </div>
    <div class="container text-center index-page-icon">
      <icon-base
        name="gallina"
        size="20vh"
      />
    </div>
    <div class="container text-center index-page-text">
      slepice
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexPage',
  computed: {
    title () {
      return this.$store.getters.getTitle
    },
    width () {
      return this.$store.getters.getWidth
    },
    iconSize () {
      return this.width < 600 ? 200 : 250
    }
  }
}
</script>
<style lang="stylus">
.index-page-text
  font-family: var(--font-family-headers)
  font-size: 7vh
  font-weight: 700
.index-page-text, .index-page-icon
  text-align: center
.page-wrap
  flex: 1
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
</style>
