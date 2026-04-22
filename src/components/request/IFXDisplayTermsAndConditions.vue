<script>
export default {
  name: 'IFXDisplayTermsAndConditions',
  props: ['data'],
}
</script>
<template>
  <v-row class="pt-1">
    <v-col>
      {{ data }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
