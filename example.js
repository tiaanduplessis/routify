const routify = require('./')
const http = require('http')

const app = routify()

app.use(({ req }, next) => {
  console.log(`Request to ${req.url}`)
  next()
})

app.route({
  url: '/',
  method: 'GET',
  handler: (ctx, next) => {
    ctx.res.end('Hai')
  }
})

app.route({
  url: '/foo',
  method: 'GET',
  handler: (ctx, next) => {
    ctx.res.end('foo!')
  }
})

http.createServer(app.lookUp).listen(8888)
