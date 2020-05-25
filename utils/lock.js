var fs = require('fs')

if (typeof exports === 'undefined') var exports = {}

exports.exists = function(filename) {
  try {
    return (fs.lstatSync(filename) ? true : false)
  } catch (err) {
    return false
  }
}

exports.read = function(filename) {
  try{
    return fs.readFileSync(filename, 'utf8')
  } catch(err) {
    return false
  }
}

exports.create = function(filename,  contents) {
  try {
    if (!contents) contents = ''
      fs.writeFileSync(filename, contents)
      return true
    } catch (err) {
      return false
  }
}

exports.remove = function(filename) {
  try {
    return fs.unlinkSync(filename)
  } catch (err) {
    return false
  }
}
