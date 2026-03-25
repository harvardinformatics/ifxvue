<script>
// TODO prevent mutating props
/* eslint-disable */
export default {
  name: 'IFXRequestCommentList',
  props: {
    request: Object
  },
  data() {
    return {}
  },
  methods: {
    updateRequestComment(index, text) {
      // when passed null in text, it means to remove
      const data = { index: index }
      if (text) {
        data.text = text
      }
      this.$emit('update', data)
    }
  }
}
</script>
<template>
  <v-container class="mb-3">
    <v-row density="comfortable" class="justify-start">
      <v-col cols="8">
        <v-row class="flex-column">
          <v-col cols="12" v-for="(requestComment, index) in request.requestComments" :key="requestComment.id">
            <v-row justify-start align-center>
              <v-col v-if="requestComment.id" cols="8" class="request-comment">
                <span v-html="requestComment.text"></span>
              </v-col>
              <v-col v-else cols="8" class="request-comment">
                <v-textarea
                  v-model="request.requestComments[index].text"
                  auto-grow
                  clearable
                  rows="3"
                  solo
                >
                </v-textarea>
              </v-col>
              <v-col v-if="requestComment.id" cols="3" class="request-author" align-content-end>
                <span></span>&nbsp;
                <span style="white-space: nowrap;">{{$humanDatetime(requestComment.created)}}</span>
              </v-col>
              <v-col v-if="requestComment.id">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" text
                      class="item-delete"
                      color="error"
                      @click="request.requestComments.splice(index, 1) && updateRequestComment(index)"
                    >
                      <v-icon dark >mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove comment</span>
                </v-tooltip>
              </v-col>
              <v-col v-else>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" text
                      class="item-save"
                      color="green"
                      @click="updateRequestComment(index, request.requestComments[index].text)"
                    >
                      <v-icon dark>mdi-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Save comment</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" size="x-small" text
                      class="item-delete"
                      color="error"
                      @click="request.requestComments.splice(index, 1)"
                    >
                      <v-icon dark >mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove comment</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col>&nbsp;</v-col>
    </v-row>
  </v-container>
</template>
<style>
  .request-comment {
    color: #00796B;
    font-size: larger;
    margin: 0em;
  }
  .request-author {
    font-style: italic;
  }
</style>
