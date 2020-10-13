<template>
  <nav class="tab-navi">
    <ul>
      <li
        v-for="link in links"
        :class="{'navi-active': $route.name === link.key}"
        :key="link.key"
      >
        <router-link
          :to="link.href"
          :key="link.key"
        >
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TabNavi',
  computed: {
    links () {
      return this.$store.getters.getLinks
    }
  }
}
</script>
<style lang="stylus">
.tab-navi
  display: block
  margin-top: 1rem
  & ul
    list-style: none
    display: flex
    justify-content: space-between
    margin: 0
    border-radius: var(--border-radius)
    box-shadow: 0 0 0 1px var(--primary)
    padding: 0
    overflow: hidden
    & li
      min-width: 0
      display: flex
      flex: 1 1 auto
      min-height: 5rem
      transition: all 0.3s ease-in-out
      padding: 0.6rem
      background: var(--primary300)
      & > a
        flex: 1
        min-width: 0
        text-decoration: none
        color: var(--text-color)
        font-size: 1.6re
        font-weight: 60
        display: flex
        align-items: center
        justify-content: center
        border-radius: var(--border-radius)
        background: var(--primary300)
        transition: all 0.3s ease-in-out
        &:hover
          background: var(--primary400)
        &:focus, &:active
          outline: none
          box-shadow: var(--focus-shadow)
      &.navi-active
        background: var(--primary)
        & > a
          background: inherit
          color: #fff
          pointer-events: none
</style>
