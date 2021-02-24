<template>
  <Editor
    v-model='text'
    :init="init"
  ></Editor>
</template>

<script>
// TODO: extend vuetify input to make this component swork better with forms
// import VInput from 'vuetify/lib/components/VInput/VInput'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'IFXTextEditor',
  // extends: VInput,
  components: {
    Editor
  },
  props: {
    getText: {
      type: Function,
      required: true
    },
    setText: {
      type: Function,
      required: true
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
    }
  },
  computed: {
    text: {
      get() {
        return this.getText()
      },
      set(value) {
        this.setText(value)
      }
    },
    init() {
      return {
        height: 300,
        menubar: false,
        statusbar: false,
        plugins: [
          'advlist autolink lists link image charmap',
          'searchreplace visualblocks code fullscreen',
          'print preview anchor insertdatetime media',
          'paste code help wordcount table'
        ],
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
        setup: editor => { editor.on('init', () => this.initCallback()) }
      }
    },
  },
  created() {
    this.isLoading = true
  }
}
</script>

<style>
  /* TODO: register domain */
  .tox-notifications-container {
    display: none !important;
  }
</style>
