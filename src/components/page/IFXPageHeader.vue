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
        'header-font-xs': this.$vuetify.breakpoint.xs
      }
    },
    /**
     * Returns classes for actions container based on active breakpoints
     * @returns {object} keys are class names and values are boolean values for active breakpoints
     */
    actionsContainerClass() {
      return {
        'actions-ctr-lg': this.$vuetify.breakpoint.mdAndUp,
        'actions-ctr-sm': this.$vuetify.breakpoint.smAndDown
      }
    }
  }
}
</script>

<template>
  <v-container>
    <v-col>
      <v-row v-if="hasTitle" justify="space-between" align="center">
        <div class='title-ctr'>
          <h1 data-cy='header-title' :class="headerClass"><slot name="title"></slot></h1>
          <h1 data-cy='header-id' :class='headerClass'><slot name='id'></slot></h1>
          <span data-cy='header-id' class='d-none'><slot name='cypress'></slot></span>
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
      <v-row v-if="hasContent" class='content-ctr'>
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
    margin-left: .5rem;
  }
</style>
