<template>
  <div class="container title-row">
    <h3>{{ title }}</h3>
    <div
      v-if="!noButtons"
      class="title-arrows"
    >
      <template v-if="!editButton">
        <calendar-arrow
          direction="left"
          @click="$emit('change-date', 'minus')"
        />
        <calendar-arrow
          direction="right"
          @click="$emit('change-date', 'plus')"
        />
      </template>
      <template v-else>
        <t-btn
          :options="editEndButton"
          @click="$emit('edit-button-click')"
        />
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TitleRow',
  props: {
    title: {
      type: String,
      required: true
    },
    editButton: {
      type: Boolean,
      default: false
    },
    noButtons: {
      type: Boolean, 
      default: false
    }
  },
  computed: {
    editEndButton () {
      return !this.editButton
        ? {}
        : {
          label: 'ukončit úpravy',
          href: '/day/' + this.$parent.dayDbFormat
        }
    },
  }
}
</script>
<style lang="stylus">
.title-row
  display: flex
  flex-direction: column
  align-items: center
  flex-shrink: 
  & > h3
    font-size: 1.8rem
    border-bottom: 2px solid var(--primary400)
    margin-bottom: 2rem

.title-arrows 
  display: flex
  justify-content: center
  & > *:not(:last-child)
    margin-right: 0.2rem

@media only screen and (min-width: 450px)
  .title-row
    flex-direction: row
    justify-content: space-between
    & > h3
      margin-bottom: 0

  .title-arrows
    justify-content: flex-end

</style>