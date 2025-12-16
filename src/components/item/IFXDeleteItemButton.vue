<script>
import { mapActions } from 'vuex'
import IFXActionDialog from '@/components/action/IFXActionDialog'

export default {
  name: 'IFXDeleteItemButton',
  components: {
    IFXActionDialog
  },
  props: {
    itemType: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    apiRef: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDialogActive: false
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    toggleDialog() {
      this.isDialogActive = !this.isDialogActive
    },
    cancelAction() {
      this.toggleDialog()
    },
    completeAction() {
      this.action.execute()
        .then(() => this.action.onSuccess())
        .catch((err) => this.action.onError(err))
    }
  },
  computed: {
    action() {
      return {
        key: 'deleteItem',
        name: 'Delete Item',
        description: 'This action will delete the selected item.',
        execute: async () => this.apiRef.delete(this.item),
        onSuccess: () => {
          this.toggleDialog()
          this.showMessage('This item has been deleted')
          this.$router.push({ name: `${this.itemType}List` })
        },
        onError: (error) => {
          this.toggleDialog()
          this.showMessage(error)
        },
        condition: (item) => item,
      }
    }
  }
}
</script>

<template>
  <span>
    <IFXButton data-cy="item-delete" size="x-small" btnType="remove" @action="toggleDialog"></IFXButton>
    <IFXActionDialog
      :selectedAction="action"
      :selectedItems="[item]"
      v-model:isActive="isDialogActive"
      @cancel-action="cancelAction"
      @complete-action="completeAction"
    ></IFXActionDialog>
  </span>
</template>