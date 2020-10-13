<template>
  <div class="not-found-page">
    <h3>404</h3>
    <p>požadovaný obsah se nepodařilo najít ...</p>
    <t-btn
      :options="btnOptions"
      color="secondary"
    />
  </div>
</template>
<script>
// TODO: komplet celá page-component
export default {
  name: 'NotFound',
  data () {
    return {
      btnOptions: {
        href: '/',
        label: 'zpět na úvod'
      }
    }
  },
  computed: {

  },
  methods: {
  }
}
</script>
<style lang="stylus">
.not-found-page
  display: flex
  flex-direction: column
  align-items: center

.not-found-page > p 
  padding-bottom: 2rem

</style>