const express = require('express')
const bodyparser = require('body-parser')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const {connectMongoDb} = require("./db");
const path = require("path");
const errorMiddleware = require("./middlewares/errorMiddleware");
const isAuthorized = require("./middlewares/isAuthorized");
const socketService = require('./services/io')
const app = express()

// app.use(bodyparser.urlencoded()) // x-www-form-url-encoded format
app.use(bodyparser.json()) // application/json
app.use(express.static(path.join(__dirname, 'public')) )
app.use(errorMiddleware)

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)


connectMongoDb().then(()=> {
  const server = app.listen(8080)
  const io = socketService.init(server)
  io.on('connection', () => {
    console.log('connected')
  })
  }
)

