<script>
import IFXButton from '@/components/IFXButton'

export default {
  name: 'App',
  components: {
    IFXButton,
  },
  mounted() {},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {},
}
</script>
<template>
  <v-app>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>
            Local App
          </v-col>
        </v-row>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col>
            <IFXButton btnType="submit" btnText="Click me!" />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-app>
</template>
<style scoped lang="scss"></style>
