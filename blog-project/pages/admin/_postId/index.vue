<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '~/components/Admin/AdminPostForm'
import axios from 'axios'
export default {
  components: {
    AdminPostForm
  },
  asyncData(context) {
    return axios
      .get(
        `https://react-my-burger-36ace.firebaseio.com/posts/${context.params.postId}.json`
      )
      .then(res => {
        return {
          loadedPost: { ...res.data, id: context.params.postId }
        }
      })
      .catch(err => {
        context.error(err)
      })
  },

  layout: 'admin',
  methods: {
    onSubmitted(editedPost) {
      this.$store.dispatch('editPost', editedPost).then(res => {
        this.$router.push('/')
      })
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
