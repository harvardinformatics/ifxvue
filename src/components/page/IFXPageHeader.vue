<script>
export default {
  name: 'IFXPageHeader',
  computed: {
    /**
     * Determines if title slot is filled
     * @returns {boolean}
     */
    hasTitle() {
      return !!this.$slots.title
    },
    /**
     * Determines if subtitle slot is filled
     * @returns {boolean}
     */
    hasSubtitle() {
      return !!this.$slots.subtitle
    },
    /**
     * Determines if content slot is filled
     * @returns {boolean}
     */
    hasContent() {
      return !!this.$slots.content
    },
    /**
     * Returns classes for header based on active breakpoints
     * @returns {object} keys are class names and values are boolean values for active breakpoints
     */
    headerClass() {
      return {
        'header-base': true,
        'header-font-lg': this.$vuetify.breakpoint.mdAndUp,
        'header-font-sm': this.$vuetify.breakpoint.sm,
        'header-font-xs': this.$vuetify.breakpoint.xs,
      }
    },
    /**
     * Determines if a ?next= query param is in the route
     * This is used for the back arrow
     * @returns {boolean}
     */
    hasNextQueryParam() {
      return this.$route.query && this.$route.query.next
    },
    /**
     * Returns classes for actions container based on active breakpoints
     * @returns {object} keys are class names and values are boolean values for active breakpoints
     */
    actionsContainerClass() {
      return {
        'actions-ctr-lg': this.$vuetify.breakpoint.mdAndUp,
        'actions-ctr-sm': this.$vuetify.breakpoint.smAndDown,
      }
    },
    backArrowClass() {
      return {
        'back-medium': this.$vuetify.breakpoint.mdAndUp,
        'back-small': this.$vuetify.breakpoint.smAndDown,
      }
    },
    hasID() {
      // Only show id H1 if the slot has something in it (for accessibility)
      console.log(this.$slots, this.$scopedSlots)
      return !!this.$scopedSlots.id
    },
  },
}
</script>

<template>
  <v-container>
    <v-col class="pt-0">
      <v-row v-if="hasNextQueryParam">
        <v-col class="px-0">
          <div @click.prevent="rtr.back()" class="d-flex align-center blue--text text--darken-2 pointer">
            <v-icon class="mr-1 blue--text text--darken-2" :class="backArrowClass">mdi-arrow-left</v-icon>
            <span class="text-body-1 text-md-h6 font-weight-medium no-line-height">Back</span>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="hasTitle" justify="space-between" align="center" class="my-0">
        <div class="title-ctr">
          <h1 data-cy="header-title" :class="headerClass"><slot name="title"></slot></h1>
          <h1 v-if="hasID" data-cy="header-id" :class="headerClass"><slot name="id"></slot></h1>
          <span data-cy="header-id" class="d-none"><slot name="cypress"></slot></span>
        </div>
        <div class="actions-ctr" :class="actionsContainerClass">
          <slot name="actions">
            <div class="actions-wrapper"></div>
          </slot>
        </div>
      </v-row>
      <v-row v-if="hasSubtitle" class="subtitle-ctr">
        <p><slot name="subtitle"></slot></p>
      </v-row>
      <v-row v-if="hasContent" class="content-ctr">
        <slot name="content"></slot>
      </v-row>
    </v-col>
    <v-divider></v-divider>
  </v-container>
</template>

<style scoped>
.content-ctr {
  width: 70%;
}
.header-base {
  display: inline;
}
.header-font-sm {
  font-size: 1.75rem;
}
.header-font-xs {
  font-size: 1.5rem;
}
.actions-ctr {
  position: relative;
}
.actions-ctr > *:not(:last-child) {
  display: inline-block !important;
  margin-right: 1rem !important;
}
.actions-ctr-sm > * {
  margin-left: 0.5rem;
}
.back-medium {
  font-size: 24px;
}
.back-small {
  font-size: 19px;
}
.pointer {
  cursor: pointer;
}
.no-line-height {
  line-height: 1;
}
</style>
