<script>
export default {
  name: 'IFXDisplayExpenseCode',
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
