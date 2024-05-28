export default {
  isAuthorized: (_parent, _args, context) => {
    if (!context.user) {
      throw new Error('Unauthorized')
    }
    return true
  },
}
