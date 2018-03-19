export default function ({
    store,
    error
  }) {
    if (!store.state.user.info) {
      error({
        message: 'You are not connected',
        statusCode: 403
      })
    }
  }
  