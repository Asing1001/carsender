export default function ({ store, error }) {
  if (!store.state.authUser) {
    error({
      message: '請登入以繼續',
      statusCode: 403
    })
  }
}
