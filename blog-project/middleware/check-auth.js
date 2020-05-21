export default function (context) {
  console.log('[Middleware] check-auth.js')
  context.store.dispatch('initAuth', context.req)

}
