<template>
  <div
    class="page-data"
    :class="{ 'align-center': noEggs }"
  >
    <ul>
      <template v-if="rows && !noEggs">
        <li
          v-for="row in rows"
          :key="row.label"
        >
          <div>{{ row.label }}</div>
          <div>{{ row.value }}</div>
        </li>
      </template>
      <template v-else>
        <li class="no-eggs">
          <div>žádná vejce</div>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'PageData',
  props: {
    rows: {
      validator: (v) => Array.isArray(v) || v === null,
      required: true
    },
    noEggs: {
      type: Boolean, default: false
    }
  }
}
</script>
<style lang="stylus">
.page-data 
  font-size: 1.6rem
  border: 1px solid var(--border-light)
  border-radius: var(--border-radius)
  margin: 0
  align-self: stretch

@media only screen and (min-width: 700px)
  .page-data
    max-width: 40.0rem
    align-self: flex-start

.page-data ul
  padding: 0
  margin: 0
  list-style: none
  & > li
    padding: 0.5rem 1rem
    & > div
      white-space: nowrap
      text-overflow: ellipsis
    &.no-eggs
      text-align: center
    &:not(.no-eggs)
      display: flex
      justify-content: space-between
      &:not(:last-child)
        border-bottom: 1px solid var(--border-light)
      & > *:last-child
        text-align: right
        font-weight: 600
        padding-left: 1rem
      & > *:first-child
        text-align: left
        font-weight: 400
        padding-right: 1rem

.align-center 
  align-self: center
</style>