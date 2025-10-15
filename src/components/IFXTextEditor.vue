<template>
  <Editor
    :model-value="modelValue"
    @update:model-value="handleUpdate"
    :init="init"
    tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.4/tinymce.min.js"
  ></Editor>
</template>

<script>
// https://www.tiny.cloud/docs/integrations/vue/
// TODO: extend vuetify input to make this component work better with forms
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'IFXTextEditor',
  components: {
    Editor,
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    initCallback() {
      this.isLoading = false
    },
    handleUpdate(value) {
      this.$emit('update:modelValue', value)
    },
  },
  computed: {
    init() {
      return {
        height: 300,
        menubar: false,
        statusbar: false,
        plugins:
          'advlist autolink lists link image charmap searchreplace visualblocks fullscreen preview anchor insertdatetime media code help wordcount table',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
        setup: (editor) => {
          editor.on('init', () => this.initCallback())
        },
      }
    },
  },
  created() {
    this.isLoading = true
  },
}
</script>

<style>
/* TODO: register domain */
.tox-notifications-container {
  display: none !important;
}
</style>