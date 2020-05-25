/*
 * filter a json object by a list of allowed keys
 * eg filterObj(json, ['id', 'comment']
 */
function filterObj (raw, allowed) {
  return Object.keys(raw)
  .filter(key => allowed.includes(key))
  .reduce((obj, key) => {
    obj[key] = raw[key]
    return obj
  }, {})
}

module.exports = { filterObj }
