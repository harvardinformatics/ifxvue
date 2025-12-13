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
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
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
    noItemsText() {
      return this.noItemsString !== undefined ? this.noItemsString : `There are no ${this.title.toLowerCase()}.`
    },
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
        size="x-small"
        v-if="!disabled"
        :disabled="!canEdit"
        @action="addItem"
        btnType="add"
      ></IFXButton>
    </div>
    <div v-if="!itemsLocal.length" class="items-warning">{{ noItemsText }}</div>
    <v-card :key="item.id" v-for="(item, index) in itemsLocal" class="data-card">
      <IFXButton
        class="delete-btn"
        v-if="!disabled"
        :disabled="!canEdit"
        size="x-small"
        @action="removeItem(index)"
        btnType="remove"
      ></IFXButton>
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