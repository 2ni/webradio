module.exports = {
  fn2name: function (fn) {
    return fn.replace(/\.[^.]*$/, '')
  },
  ifeq: function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this): options.inverse(this)
  }
}
