<template>
  <v-dialog v-model="isActiveLocal" persistent :max-width="maxWidth">
    <v-card>
      <v-card-title class="headline">Confirm Action</v-card-title>
      <v-card-text>
        <div class='dialog-item'>
          <span class='dialog-label'>
            <strong>Action: </strong>
            <span class='dialog-text'>{{selectedAction.name}}</span>
          </span>
        </div>
        <div class='dialog-item'>
          <span class='dialog-label'>
            <strong>Description: </strong>
            <span class='dialog-text'>{{selectedAction.description}}</span>
          </span>
        </div>
        <div class='dialog-item' v-if="selectedAction.allowMultiple">
          <span class='dialog-label'>
            <strong>{{descriptor}}: </strong>
            <span class='dialog-text'>{{selectedItemsFormatted}}</span>
          </span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="$emit('cancel-action')">Cancel</v-btn>
        <v-btn color="primary" data-cy='complete-action' text @click="$emit('complete-action')">Complete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ActionDialog',
  props: {
    selectedAction: {
      type: Object,
      required: true
    },
    selectedItems: {
      type: Array,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    descriptor() {
      if (this.selectedItems.length > 1) return 'Items'
      return 'Item'
    },
    selectedItemsFormatted() {
      // Selected items should be homogenous, so check first item for shape
      const firstItem = this.selectedItems[0]
      const { id, fullName, email, name } = firstItem
      if (fullName) {
        return this.selectedItems.map(item => item.fullName).join(', ')
      }
      if (name) {
        return this.selectedItems.map(item => item.name).join(', ')
      }
      if (email) {
        return this.selectedItems.map(user => user.email).join(', ')
      }
      if (id) {
        return this.selectedItems.map(item => item.id).join(', ')
      }
      return this.selectedItems.map(s => s)
    },
    isActiveLocal: {
      get() {
        return this.isActive
      },
      set(isActive) {
        this.$emit('update:isActive', isActive)
      }
    },
    maxWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
        default: return 320
      }
    }
  }
}
</script>
