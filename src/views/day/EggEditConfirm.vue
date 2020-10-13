<template>
  <transition name="tslide-down">
    <div
      v-if="show"
      class="egg-edit-popover"
    >
      <div class="egg-edit-popover-message">
        {{ 'opravdu smazat vejce č. ' + eggNumber + ' ?' }}
      </div>
      <div class="egg-edit-popover-buttons">
        <t-btn
          color="primary"
          :options="buttonDelete"
          @click="$emit('delete')"
        />
        <t-btn
          color="secondary"
          :options="buttonCancel"
          @click="$emit('cancel')"
        />
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'EggEditConfirm',
  props: {
    show: { type: Boolean, default: false },
    eggNumber: { type: Number, required: true }
  },

  data () {
    return {
      buttonDelete: {
        label: 'ano, smazat'
      },
      buttonCancel: {
        label: 'ne, zpět'
      }
    }
  }
}
</script>
