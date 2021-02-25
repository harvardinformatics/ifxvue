<template>
  <span>
    <IFXActionDialog
      :selectedAction='selectedAction'
      :selectedItems='selectedItemsLocal'
      :isActive.sync='isDialogActive'
      @cancel-action='cancelAction'
      @complete-action='completeAction'
    ></IFXActionDialog>
    <v-select
      class="action-item"
      :items="computedActions"
      item-text="name"
      return-object
      v-model="selectedAction"
      @change='toggleDialog'
      label="Available Actions"
      hint="Select"
      :disabled='isDisabled'
      ref='actionSelectField'
      data-cy='action-select'
    >
    </v-select>
  </span>
</template>

<script>
import has from 'lodash/has'
import IFXActionDialog from '@/components/action/IFXActionDialog'
import { mapActions } from 'vuex'

export default {
  name: 'IFXActionSelect',
  components: {
    IFXActionDialog
  },
  props: {
    actions: {
      type: Array,
      required: false,
      default: () => []
    },
    // Allows user to indicate which of the default actions should be allowed
    // The key corresponds to the key of action in the library
    actionKeys: {
      type: Array,
      required: false,
      default: () => []
    },
    apiRef: {
      type: Object,
      required: false
    },
    selectedItems: {
      type: Array,
      required: true
    },
    allItems: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      isDialogActive: false,
      selectedAction: {}
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    toggleDialog() {
      this.isDialogActive = !this.isDialogActive
    },
    updateUser(user) {
      this.$api.user.update(user)
    },
    cancelAction() {
      this.toggleDialog()
      this.selectedAction = {}
    },
    resetSelect() {
      this.toggleDialog()
      this.selectedItemsLocal = []
      this.selectedAction = {}
    },
    async completeAction() {
      await this.sleep(100)
      // Store reference of field to blur on completion
      this.$refs.actionSelectField.blur()
      try {
        const res = await this.selectedAction.execute(this.selectedItemsLocal)
        if (has(this.selectedAction, 'onSuccess')) {
          this.selectedAction.onSuccess(res)
        }
      } catch (error) {
        if (has(this.selectedAction, 'onError')) {
          this.selectedAction.onError(error)
        } else {
          this.showMessage(error)
        }
        throw error
      } finally {
        this.resetSelect()
      }
    }
  },
  computed: {
    selectedItemsLocal: {
      get() {
        return this.selectedItems
      },
      set(selectedItems) {
        this.$emit('update:selectedItems', selectedItems)
      }
    },
    // Library of default actions
    // key: used to reference the action
    // name: display name
    // description: display description
    // condition: condition for this action to be available, must pass for every item in list otherwise action is not available
    // execute: function to be executed, i.e. the action to be taken
    // onSuccess: callback if execution is successful
    // onError: callback if execution is unsuccessful
    // allowMultiple: if action allows for multiple items to be selected
    defaultActions() {
      const actions = [
        {
          key: 'activateUserLogin',
          name: 'Activate User Login',
          description: `This will activate the ${this.$api.vars.appNameFormatted} login for the selected users.`,
          condition: (user) => !user.isActive,
          execute: async (selected) => Promise.all(selected.map((u) => {
            const user = u
            user.isActive = true
            user.changeComment = `Enable login for ${user.fullName}.`
            return this.$api.user.update(user)
              .catch((err) => this.showMessage(err))
          })),
          onSuccess: () => this.showMessage('Activation successful.'),
          onError: (error) => this.showMessage(error),
          allowMultiple: true
        },
        {
          key: 'loadMessage',
          name: 'Load Message',
          description: `This will load the selected mailing for use in a new mailing.
          You will be navigated there after confirmation.`,
          execute: async (selected) => {
            const message = selected[0]
            this.$store.dispatch('mailing/loadMessage', message)
          },
          onSuccess: () => this.rtr.push({ name: 'MailingCompose' }),
          onError: (error) => this.showMessage(error),
          condition: (item) => item,
          allowMultiple: false
        },
        {
          key: 'deactivateUserLogin',
          name: 'Deactivate User Login',
          description: `This will deactivate the ${this.$api.vars.appNameFormatted} login for the selected users.`,
          condition: (user) => user.isActive,
          execute: async (selected) => Promise.all(selected.map((u) => {
            const user = u
            user.isActive = false
            user.changeComment = `Disable login for ${user.fullName}.`
            return this.$api.user.update(user)
              .catch((err) => this.showMessage(err))
          })),
          onSuccess: () => this.showMessage('Deactivation successful.'),
          onError: (error) => this.showMessage(error),
          allowMultiple: true
        },
        {
          key: 'addMailingTo',
          name: 'Add to Mailing: "To"',
          description: `This will add the items to the "To" field of an existing mailing.
          You will be navigated there after confirmation.`,
          execute: async (selected) => {
            const payload = { key: 'to', values: selected }
            this.$store.dispatch('mailing/appendValues', payload)
          },
          onSuccess: () => this.rtr.push({ name: 'MailingCompose' }),
          onError: (error) => this.showMessage(error),
          condition: (item) => item,
          allowMultiple: true
        },
        {
          key: 'addMailingCC',
          name: 'Add to Mailing: "CC"',
          description: `This will add the following items to the "CC" field of an existing mailing.
          You will be navigated there after confirmation.`,
          execute: async (selected) => {
            const payload = { key: 'cc', values: selected }
            this.$store.dispatch('mailing/appendValues', payload)
          },
          onSuccess: () => this.rtr.push({ name: 'MailingCompose' }),
          onError: (error) => this.showMessage(error),
          condition: (item) => item,
          allowMultiple: true
        },
        {
          key: 'addMailingBCC',
          name: 'Add to Mailing: "BCC"',
          description: `This will add the following items to the "BCC" field of an existing mailing.
          You will be navigated there after confirmation.`,
          execute: async (selected) => {
            const payload = { key: 'bcc', values: selected }
            this.$store.dispatch('mailing/appendValues', payload)
          },
          onSuccess: () => this.rtr.push({ name: 'MailingCompose' }),
          onError: (error) => this.showMessage(error),
          condition: (item) => item,
          allowMultiple: true
        },
        {
          key: 'loadMailing',
          name: 'Load Mailing',
          description: `This will load the selected mailing for use in a new mailing.
          You will be navigated there after confirmation.`,
          execute: async (selected) => {
            const mailing = selected[0]
            this.$store.dispatch('mailing/loadMailing', mailing)
          },
          onSuccess: () => this.rtr.push({ name: 'MailingCompose' }),
          onError: (error) => this.showMessage(error),
          condition: (item) => item,
          allowMultiple: false
        },
        {
          key: 'deleteItems',
          name: 'Delete',
          description: 'This action will delete the selected items.',
          execute: async (selected) => Promise.all(selected.map((i) => {
            const item = i
            return this.apiRef.delete(item)
              .catch((err) => this.showMessage(err))
          })),
          onSuccess: () => {
            this.$emit('get-set-items')
            this.showMessage('Items deleted.')
          },
          onError: (error) => this.showMessage(error),
          condition: (item) => item,
          allowMultiple: true
        },
        {
          key: 'deleteOrganizations',
          name: 'Delete',
          description: 'This action will delete the selected organizations.',
          execute: async (selected) => Promise.all(selected.map((o) => {
            const organization = o
            return this.apiRef.delete(organization)
              .catch((err) => this.showMessage(err))
          })),
          onSuccess: () => {
            this.$emit('get-set-items')
            this.showMessage('Organizations deleted')
          },
          onError: (error) => this.showMessage(error),
          // TODO: check if this is sufficient for deleting organization
          condition: (item) => !item.orgTree.includes('nanites'),
          allowMultiple: true
        },
        {
          key: 'deleteContacts',
          name: 'Delete',
          description: 'This action will delete the selected contacts.',
          execute: async (selected) => Promise.all(selected.map((c) => {
            const contact = c
            return this.apiRef.delete(contact)
              .catch((err) => this.showMessage(err))
          })),
          onSuccess: () => {
            this.$emit('get-set-items')
            this.showMessage('Contacts deleted.')
          },
          onError: (error) => this.showMessage(error),
          condition: (item) => !item.ifxcon,
          allowMultiple: true
        }
      ]
      // Only use those default actions which have been specified by the user in the actionKeys prop
      return actions.filter(dAction => this.actionKeys.find(aKey => dAction.key === aKey))
    },
    /**
     * Filter actions by their condition, i.e. if every item in selected passes the defined condition
     * @return {Array} actions
     */
    computedActions() {
      // Use all actions specifed by the user in the actions prop
      const userDefinedActions = this.actions
      let actions = [this.defaultActions, userDefinedActions].flat()
      // Filter actions for those that pass the condition
      actions = actions.filter(a => this.selectedItemsLocal.every(s => a.condition(s)))
      // If more than one is selected, filter any actions that do not allow multiple
      if (this.selectedItemsLocal.length > 1) {
        actions = actions.filter(a => a.allowMultiple)
      }
      return actions
    },
    isDisabled() {
      return !this.selectedItemsLocal.length || !this.computedActions.length
    },
  },
}
</script>

<style scoped>
  .dialog-item {
    margin-top: 0.8rem;
  }
  .dialog-label {
    font-weight: 700;
  }
  .dialog-text {
    font-weight: 400;
  }
</style>
