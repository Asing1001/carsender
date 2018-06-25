export default function ({ store, error, route, redirect }) {
  if (!store.state.authUser) {
    // error({
    //   message: '請登入以繼續',
    //   statusCode: 403
    // })
    redirect('/login')
  }
}
