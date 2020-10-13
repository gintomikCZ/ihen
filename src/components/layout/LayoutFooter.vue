<template>
  <footer>
    <div
      v-if="hasButtons"
      class="footer-buttons container"
    >
      <t-btn :options="todayButton" />
      <t-btn :options="addEggButton" />
    </div>
    <div class="footer">
      <!-- comment the following line for standard VERSION -->
        <span>---DEMO VERSION---</span>

      <span>&#169;</span>
      <span> tomik 2020</span>
    </div>
  </footer>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
export default {
  name: 'LayoutFooter',
  computed: {
    dateStringToday () {
      return dh.formatDateFromObject(this.today, 'YYYY-MM-DD')
    },
    addEggButton () {
      return {
        label: 'přidat vejce',
        icon: 'egg',
        href: '/eggform/' + this.todayDateString
      }
    },
    todayButton () {
      return {
        label: 'dnešní den',
        icon: 'calendarDay',
        href: '/day/' + this.todayDateString
      }
    },
    hasButtons () {
      return this.$route.path === '/' || this.$route.path === '/total'
    },
    todayDateString () {
      return this.$store.getters.getTodayDateString
    }
  }
}
</script>
<style lang="stylus">
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  & > .footer {
    text-align: center;
    color: var(--text-color-dark);
    font-size: 1.2rem;
    line-height: 1;
    padding: 0.75rem 0rem;
    background: var(--secondary400);
    font-weight: 600;

    & > span:first-child {
      margin-right: 0.3rem;
    }
  }
}

.footer-buttons {
  display: flex;
  justify-content: center;

  & > * {
    margin: 0 0.5rem;
  }
}
</style>