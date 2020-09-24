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
        'actions-ctr': true,
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
      <v-row v-if="hasTitle" class="title-ctr" justify="space-between" align="center">
        <h1 :class="headerClass"><slot name="title"></slot></h1>
        <div :class="actionsContainerClass">
          <slot name="actions"></slot>
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

<style>
  .content-ctr {
    width: 70%;
  }

  .header-font-lg {
    font-size: 2rem;
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

  .actions-ctr-lg > * {
    margin-left: 1rem;
  }

  .actions-ctr-sm > * {
    margin-left: .5rem;
  }

  .note {
    font-style: italic;
  }
</style>
