export default function (context) {
  console.log('[Middleware] auth.js')

  if (!context.store.getters.isAuthenticated) {
    context.redirect('/admin/auth')
  }
}
