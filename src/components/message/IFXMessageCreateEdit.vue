<script>
import IFXMessageMixin from '@/components/message/IFXMessageMixin'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'IFXMessageCreateEdit',
  mixins: [IFXMessageMixin, IFXItemCreateEditMixin],
  components: {
    IFXPageActionBar,
    Editor,
  },
  props: {
    selectedMessage: Object,
  },
  computed: {
    editorInit() {
      return {
        height: 300,
        menubar: false,
        statusbar: false,
        plugins: [
          'advlist autolink lists link image charmap',
          'searchreplace visualblocks fullscreen',
          'print preview anchor insertdatetime media',
          'paste code help wordcount table'
        ],
        toolbar: 'undo redo | code | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
      }
    },
    messageTitle() {
      return this.item.displayName ? `Edit ${this.item.displayName}` : `Edit Message ${this.item.id}`
    }
  },
  methods: {
    async getItem() {
      if (this.selectedMessage) {
        return this.selectedMessage
      }
      if (this.isEditing) {
        return this.apiRef.getByID(this.id)
      }
      return this.apiRef.create()
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ messageTitle }}</template>
      <template #content>{{ description }}</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-if="!isLoading" v-model="isValid">
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.subject"
              label="Subject"
              data-cy="subject"
              :rules="formRules.generic"
              :error-messages="errors.subject"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <Editor
              v-model="item.message"
              :init="editorInit"
            ></Editor>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXPageActionBar :disabled="!isValid" btnType="submit" @action="submit" />
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>

<style></style>
