var _ = require('underscore')
var stream = require('stream')
var mysql = require('mysql')

module.exports = function (d) {
  var db
  return function (ctx, next) {
    if (!db)
      db = mysql.createPool(d)
    if (ctx.queryString == 'dbEnd')
      return db.end(ctx.done)
    if (!_.isFunction(ctx.done)) {
      return db.query(ctx.queryString).stream().pipe(new stream.Transform({
        objectMode: true,
        transform: function (data, encoding, next) {
          //ctx = _.clone(ctx)
          //ctx.data = data
          //ctx.done = function (err, data) {
            this.push(data)
            next()
          //}.bind(this)
          //self.pump(ctx)
        }
      }))
    }
    db.query(ctx.queryString, function (err, data, fields) {
      ctx.data = data
      ctx.fields = fields
      next(err)
    })
  }
}