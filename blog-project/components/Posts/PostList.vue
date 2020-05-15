<template>
  <section class="post-list">
    <PostPreview
      id="1"
      thumbnail="'https://www.comillas.edu/images/modulo_cabecera/postgrado/Propios/DiplomaLegalTech.jpg'"
      title="Hello"
      previewText="My first Post"
      :is-admin="isAdmin"
    />
  </section>
</template>

<script>
import PostPreview from '~/components/Posts/PostPreview.vue'

export default {
  components: {
    PostPreview
  },
  props: {
    isAdmin: {
      type: Boolean,
      dafault: false
    }
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
