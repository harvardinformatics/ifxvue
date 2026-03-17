<script>
export default {
  name: 'IFXDisplayExpenseCode',
  props: ['data'],
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      {{ data }}
    </v-col>
  </v-row>
</template>
<style scoped></style>
