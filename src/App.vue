<template>
  <div
    id="app"
    :class="{'has-navi': hasNavi, 'has-not-navi': !hasNavi }"
  >
    <div
      ref="popupsWrapper"
      id="popupsWrapper"
    />
    <error-component />
    <layout-header />
    <main>
      <transition
        name="tslide-down"
        mode="out-in"
      >
        <router-view />
      </transition>
    </main>
    <layout-footer />
  </div>
</template>
<script>
import LayoutHeader from './components/layout/LayoutHeader.vue'
import ErrorComponent from './components/error/ErrorComponent.vue'
import LayoutFooter from './components/layout/LayoutFooter.vue'
export default {
  computed: {
    hasNavi () {
      return this.$route.path !== '/'
    }
  },
  components: { LayoutHeader, LayoutFooter, ErrorComponent },
  created () {
    this.setDimensions()
    window.addEventListener('resize', this.setDimensions)
    return this.$store.dispatch('initialize')
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setDimensions)
  },
  methods: {
    setDimensions () {
      this.$store.commit('setWindowDimensions', { width: window.innerWidth, height: window.innerHeight })
    }
  }
}
</script>
<style lang="stylus">
@import './styles/normalize.css';
@import './styles/styles.styl';
@import './styles/transitions.styl';

</style>
