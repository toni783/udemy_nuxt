import Vuex from 'vuex'
import Cookie from 'js-cookie'
const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null
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
        return this.$axios.$post(`/posts.json?auth=${vuexContext.state.token}`, createdPost)
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
            `/posts/${editedPost.id}.json?auth=${vuexContext.state.token}`,
            editedPost
          )
          .then(res => {
            console.log(res)
            vuexContext.commit('editPost', editedPost)
          })
          .catch(err => {
            console.log(err)
          })
      },
      authenticateUser(vuextContext, authData) {
        let authUrl
        if (authData.isLogin) {
          authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.firebaseKey}`
        } else {
          authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.firebaseKey}`
        }

        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            console.log(result)

            vuextContext.commit('setToken', result.idToken)

            localStorage.setItem('token', result.idToken)
            localStorage.setItem('tokenExpiration', new Date().getTime() + +result.expiresIn * 1000)


            Cookie.set('jwt', result.idToken)
            Cookie.set('expirationDate', new Date().getTime() + +result.expiresIn * 1000)

            return this.$axios.$post('http://localhost:3000/api/track-data', {
              data: 'Atuhenticated'
            })
          })
          .catch(err => {
            console.log(err)
          })
      },

      initAuth(vuextContext, req) {

        let token
        let expirationDate
        if (req) {
          if (!req.headers.cookie) {
            return
          }
          const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
          if (!jwtCookie) {
            return
          }

          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate=')).split('=')[1]
        } else if (process.client) {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')

        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log('[Auth] No token or invalid token')
          vuextContext.commit('logout')
          return
        }
        vuextContext.commit('setToken', token)

      },
      logout(vuextContext) {
        vuextContext.commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('expirationDate')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }

      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
      isAuthenticated(state) {
        return state.token !== null
      }
    }
  })
}

export default createStore
