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
    // Has the same shape as actions in IFXActionSelect.vue
    // key: used to reference the action
    // name: display name
    // description: display description
    // condition: condition for this action to be available, must pass for every item in list otherwise action is not available
    // execute: function to be executed, i.e. the action to be taken
    // onSuccess: callback if execution is successful
    // onError: callback if execution is unsuccessful
    // allowMultiple: if action allows for multiple items to be selected
    action() {
      return {
        key: 'deleteItem',
        name: 'Delete Item',
        description: 'This action will delete the selected item.',
        execute: async () => this.apiRef.delete(this.item),
        onSuccess: () => {
          this.toggleDialog()
          this.showMessage('This item has been deleted')
          this.rtr.push({ name: `${this.itemType}List` })
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
  <IFXButton data-cy='item-delete' xSmall btnType='remove' @action='toggleDialog'></IFXButton>
  <IFXActionDialog
    :selectedAction='action'
    :selectedItems='[item]'
    :isActive.sync='isDialogActive'
    @cancel-action='cancelAction'
    @complete-action='completeAction'
  ></IFXActionDialog>
</span>
</template>
