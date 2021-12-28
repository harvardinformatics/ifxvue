// If an item is selectable (i.e. can be used in IFXItemSelectList) then it must have this shape
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    allItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    errors: {
      type: Object,
      required: false,
      default: () => ({
        contacts: {},
        users: {},
      }),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    itemLocal: {
      get() {
        return this.item
      },
      set(item) {
        this.$emit('update:item', item)
      },
    },
  },
  mounted() {
    this.isLoading = true
    this.$nextTick(() => (this.isLoading = false))
  },
}
