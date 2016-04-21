var _ = require('underscore')
var mysql = require('mysql')

module.exports = function (d) {
  var db
  return function (ctx, next) {
    if (!db)
      db = mysql.createPool(d)
    if (db && (ctx.queryString == 'dbEnd'))
      return db.end(ctx.done)
    if (!_.isFunction(ctx.done))
      return db.query(ctx.queryString).stream()
    db.query(ctx.queryString, function (err, data, field) {
      ctx.data = data
      ctx.field = field
      next(err)
    })
  }
}