import Vuex from 'vuex'
const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editPost.id)
        state.loadedPosts[postIndex] = editPost
      }
    },
    actions: {
      nuxtServerInit(vuexContext, nuxtContext) {
        return nuxtContext.app.$axios.$get(`/posts.json`)
          .then((res) => {
            const postsArray = []
            for (const key in res) {
              postsArray.push({
                ...res[key],
                id: key
              });
            }
            vuexContext.commit('setPosts', postsArray)
          })
          .catch((err) => {
            nuxtContext.error(err)
          })
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return this.$axios.$post(`/posts.json`, createdPost)
          .then(result => {
            // console.log(result)
            vuexContext.commit('addPost', {
              ...createdPost,
              id: result.name
            })
          })
          .catch(err => {
            console.log(err)
          })
      },
      editPost(vuexContext, editedPost) {

        return this.$axios.$put(
            `/posts/${editedPost.id}.json`,
            editedPost
          )
          .then(res => {
            console.log(res)
            vuexContext.commit('editPost', editedPost)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      }
    }
  })
}

export default createStore
