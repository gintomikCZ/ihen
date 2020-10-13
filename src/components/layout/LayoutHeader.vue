<template>
  <header class="container">
    <div class="titles">
      <div class="logo-wrapper">
        <transition name="tfade">
          <a
            v-if="!noIcon"
            href="/"
            class="home-link"
          >
            <icon-base
              name="gallina"
              :size="80"
              color="text-color"
            />
          </a>
        </transition>
      </div>
      <div class="titles-wrapper">
        <h1>{{ title }}</h1>
        <div class="subtitle-wrapper">
          <transition
            name="tslide-left"
            @after-leave="afterLeave"
          >
            <h2 v-if="subtitleOn">
              {{ subtitle }}
            </h2>
          </transition>
        </div>
      </div>
    </div>
    <div
      v-if="noNav"
      class="header-underline"
    />
    <tab-navi v-else />
  </header>
</template>
<script>
import { getRandomInt } from '../../helpers/helper.js'
import TabNavi from '@/components/tabnavi/TabNavi.vue'
export default {
  name: 'LayoutHeader',
  computed: {
    noIcon () {
      return this.$route.path === '/'
    },
    noNav () {
      return this.noIcon || this.$route.path === '/notfound'
    },
    subtitle () {
      return this.index === null ? '' : this.$store.getters.getSubtitle(this.index)
    },
    subtitlesRange () {
      return this.$store.getters.getSubtitlesRange
    },
    title () {
      return this.$store.getters.getTitle
    },
    displaySubtitle () {
      return this.subtitleOn && !this.subtitleLeaving
    }
  },
  data () {
    return {
      index: null,
      subtitleLeaving: false,
      subtitleOn: true
    }
  },
  components: { TabNavi },
  watch: {
    $route () {
      this.onRouteChange()
    }
  },
  methods: {
    onRouteChange () {
      if (this.subtitle) {
        this.subtitleOn = false
      }
      const oldIndex = this.index
      do {
        this.index = getRandomInt(0, (this.subtitlesRange - 1))
      }
      while (this.index === oldIndex)
    },
    afterLeave () {
      this.subtitleOn = true
    }
  }
}
</script>
<style lang="stylus">
.logo-wrapper
  min-width: 1px
  flex: 0 0 8.5rem
.titles-wrapper
  flex: 1 0 auto
  min-width: 0
  max-width: calc(100% - 9rem)
  display: flex
  flex-direction: column
  justify-content: space-between
  align-items: flex-end
.titles
  display: flex
  justify-content: space-between
  flex: 0 0 auto

header h1 
  color: var(--text-color-dark)
  margin: 0
  float: right

header h1::first-letter
  letter-spacing: 4px
  color: var(--primary600)

.subtitle-wrapper
  min-width: 0px
  overflow: hidden
  max-width: 100%

header h2
  color: var(--text-color-light)
  font-size: 1.6rem
  font-weight: 500
  font-family: var(--font-family-text)
  margin: 0
  text-align: right
  white-space: nowrap
  text-overflow: ellipsis
  overflow-x: hidden

.home-link
  padding: 0.25rem
  display: block
  border-radius: var(--border-radius)

.home-link:focus
  outline: none
  box-shadow: var(--focus-shadow)

.header-underline 
  background: var(--primary400)
  min-height: 4px
  margin-top: 1rem

</style>
