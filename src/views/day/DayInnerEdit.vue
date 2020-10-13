<template>
  <div>
    <title-row
      edit-button
      :title="dayDisplayFormat + ' - úprava'"
    />
    <div class="container page-eggs page-eggs-edit">
      <div :id="popoversId">
        <egg-edit-confirm
          :show="showConfirmDialog"
          :egg-number="indexToDelete + 1"
          @delete="onDelete"
          @cancel="onCancelDelete"
        />
        <egg-edit-weight
          :show="showInputField"
          :egg-number="indexToEdit + 1"
          :egg-id="idToEdit"
          @edit="onEdit"
          @cancel="onCancelEdit"
        />
      </div>
      <div
        class="egg-group"
        v-for="(group, index) in eggGroups"
        :key="'group' + index"
      >
        <template v-for="(eggId, index2) in group">
          <egg-cell-edit
            :egg-id="eggId"
            :key="'dayView' + eggId"
            :index="(index * groupPar) + index2"
            @deletion-requested="onDeletionRequested"
            @edit-requested="onEditRequested"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import dh from '@/helpers/dateHelper.js'
import EggCellEdit from './EggCellEdit.vue'
import EggEditConfirm from './EggEditConfirm.vue'
import EggEditWeight from './EggEditWeight.vue'
import { getUniqueId } from '../../helpers/helper'
export default {
  name: 'DayInnerEdit',
  props: {
    day: { type: Date, required: true },
    eggKeys: { type: Array, required: true },
    eggGroups: { type: Array, required: true },
    groupPar: { type: Number, required: true },
    eggCount: { type: Number, required: true }
  },
  data () {
    return {
      idToDelete: null,
      idToEdit: null,
      showConfirmDialog: false,
      showInputField: false,
      popoversId: null
    }
  },
  watch: {
    popoverIsOpen (nv) {
      if (nv) {
        document.addEventListener('mousedown', this.outsideClick)
        return
      } 
      document.removeEventListener('mousedown', this.outsideClick)
    }
  },
  created () {
    this.popoversId = getUniqueId()
  },
  computed: {
    dayDisplayFormat () {
      return !this.day ? '' : dh.formatDateFromObject(this.day, 'DDD. MMMMM YYYY')
    },
    dayDbFormat () {
      return !this.day ? '' : dh.formatDateFromObject(this.day, 'YYYY-MM-DD')
    },
    indexToDelete () {
      if (this.idToDelete === null) return null
      return this.eggKeys.indexOf(this.idToDelete)
    },
    indexToEdit () {
      if (this.idToEdit === null) return null
      return this.eggKeys.indexOf(this.idToEdit)
    },
    popoverIsOpen () {
      return this.showConfirmDialog || this.showInputField
    }
  },
  methods: {
    onDeletionRequested (eggId) {
      if (this.popoverIsOpen) return
      this.idToDelete = eggId
      this.showConfirmDialog = true
    },
    onEditRequested (eggId) {
      if (this.popoverIsOpen) return
      this.idToEdit = eggId
      this.showInputField = true
    },
    onCancelDelete () {
      this.idToDelete = null
      this.showConfirmDialog = false
    },
    onCancelEdit () {
      this.idToEdit = null
      this.showInputField = false
    },
    onEdit (weight) {
      const id = this.idToEdit
      this.showInputField = false
      this.idToEdit = null
      return this.$store.dispatch('eggs/editEgg', { id, weight })
    },
    onDelete () {
      const id = this.idToDelete
      this.showConfirmDialog = false
      this.idToDelete = null
      return this.$store.dispatch('eggs/deleteEgg', id)
    },
    outsideClick (e) {
      const el = document.getElementById(this.popoversId)
      if (!el.contains(e.target)) {
        e.preventDefault()
      }
    }
  },
  components: { EggCellEdit, EggEditWeight, EggEditConfirm }
}
</script>
