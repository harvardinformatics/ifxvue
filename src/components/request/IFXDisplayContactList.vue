<script>
export default {
  name: 'IFXDisplayContactList',
  props: [
    'data'
  ]
}
</script>
<template>
  <v-row class="flex-column">
    <v-col>
      <v-row v-for="contact in data" :key="contact.contact.detail" dense>
        <v-col>
          <v-row class="flex-column" dense>
            <v-col>
              <v-row dense>
                <v-col cols="6">
                  {{contact.role}}
                </v-col>
                <v-col>
                  {{contact.contact.detail}}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style scoped>

</style>
