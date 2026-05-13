<script>
export default {
  name: 'IFXDisplayExpenseCode',
  props: ['data'],
}
</script>
<template>
  <v-layout column>
    <v-flex>
      {{ data }}
    </v-flex>
  </v-layout>
</template>
<style scoped></style>
