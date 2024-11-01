<script>
export default {
  name: 'IFXDisplayExpenseCode',
  props: ['data'],
}
</script>
<template>
  <v-layout row>
    <v-flex xs4>
      Expense Code
    </v-flex>
    <v-flex>
      {{ data }}
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
