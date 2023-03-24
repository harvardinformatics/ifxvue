<script>
export default {
  name: 'IFXItemSelectList',
  props: {
    title: {
      type: String,
      required: false,
      default: () => 'Items',
    },
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    // Function for creating an empty item, usually an empty version of the item type itself
    getEmptyItem: {
      type: Function,
      required: false,
      default: () => () => null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    noItemsString: {
      type: String,
      required: false,
      default: () => `There are no ${this.title.toLowerCase()}.`,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    // If user adds an item, an empty version of that item should be added to the display for data entry
    async addItem() {
      const emptyItem = await this.getEmptyItem()
      this.itemsLocal.push(emptyItem)
      this.$emit('update:items', this.items)
    },
    removeItem(index) {
      this.itemsLocal.splice(index, 1)
      this.$emit('update:items', this.items)
    },
    canEdit() {
      // TODO: add permissions
      return true
    },
    checkValidForm() {
      this.$emit('check-valid-form')
    },
  },
  computed: {
    itemsLocal: {
      get() {
        return this.items
      },
      set(items) {
        this.$emit('update:items', items)
      },
    },
  },
}
</script>

<template>
  <div class="data-ctr">
    <div class="data-header-active">
      <div class="data-title">{{ title }}</div>
      <IFXButton
        class="add-btn"
        xSmall
        v-if="!disabled"
        :disabled="!canEdit"
        @action="addItem"
        btnType="add"
      ></IFXButton>
    </div>
    <div v-if="!itemsLocal.length" class="items-warning">{{ noItemsString }}</div>
    <v-card :key="item.id" v-for="(item, index) in itemsLocal" class="data-card">
      <IFXButton
        class="delete-btn"
        v-if="!disabled"
        :disabled="!canEdit"
        xSmall
        @action="removeItem(index)"
        btnType="remove"
      ></IFXButton>
      <!-- TODO: Notice that there is no updateItem handler passed in - this means the item prop is being mutated directly in child -->
      <!-- NOTE: this slot occurs in a for loop, i.e. a new slot is being generated for each item instance -->
      <slot :item="item"></slot>
    </v-card>
  </div>
</template>

<style scoped>
.data-ctr {
  margin: 0.5rem 0 1.3rem 0;
}

.data-header-active,
.data-header-inactive {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.data-header-inactive {
  color: grey;
}

.data-card {
  margin-top: 0.5rem;
  padding: 10px 20px;
}

.data-title {
  min-width: 0;
  font-weight: 700;
  font-size: 1.3rem;
}

.v-btn.item-add {
  min-width: 0px;
  height: 20px;
  width: 20px;
  padding: 0;
  margin-left: 0.5em;
}

.add-btn {
  margin-left: 0.5rem;
}

.delete-btn {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
