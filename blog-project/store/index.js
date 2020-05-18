import Vuex from 'vuex'
import axios from 'axios'
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
        return axios.get('https://react-my-burger-36ace.firebaseio.com/posts.json')
          .then((res) => {
            const postsArray = []
            for (const key in res.data) {
              postsArray.push({
                ...res.data[key],
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
        return axios
          .post('https://react-my-burger-36ace.firebaseio.com/posts.json', createdPost)
          .then(result => {
            // console.log(result)
            vuexContext.commit('addPost', {
              ...createdPost,
              id: result.data.name
            })
          })
          .catch(err => {
            console.log(err)
          })
      },
      editPost(vuexContext, editedPost) {

        return axios
          .put(
            `https://react-my-burger-36ace.firebaseio.com/posts/${editedPost.id}.json`,
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
