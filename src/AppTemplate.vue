<script>
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'App',
  components: {
    IFXPageActionBar,
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
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <v-row>
                <v-col>
                  Local App
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="text-body-1">
              To use this local app for development:
              <ol>
                <li>
                  add your code to
                  <code>App.vue</code>
                </li>
                <li>
                  From a terminal, use the
                  <code>make serve</code>
                  or
                  <code>npm run serve</code>
                  commands to start a development server
                </li>
                <li>???</li>
                <li>Profit!</li>
              </ol>
              <div class="mt-2">
                The dev server will do hot-reloading. The
                <code>mdi</code>
                icons should be available. Note there is
                <i>no</i>
                back-end so all data will have to be mocked. In this example, the button below is part of an
                <code>IFXPageActionBar</code>
                component.
              </div>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col>
                  <IFXPageActionBar btnType="submit" btnText="Click me!" :disabled="false" />
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<style scoped lang="scss"></style>
