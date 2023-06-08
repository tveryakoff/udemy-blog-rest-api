const mongoose = require('mongoose')

const URI = 'mongodb+srv://tveryakoff:mongoDb123@online-shop-mongodb.buwgsfv.mongodb.net'
const DB_NAME = 'blog'

const connectMongoDb = () => mongoose.connect(`${URI}/?retryWrites=true&w=majority`, {dbName: DB_NAME}).then((mongoClient) => {
  console.log('connected to Mongo Db')
}).catch(e => {
  console.log('Error during connection to mongo db', e)
})



module.exports = {
  connectMongoDb,
}
