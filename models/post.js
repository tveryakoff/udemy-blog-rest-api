const mongoose = require('mongoose')
const {USER_MODEL_NAME} = require("./user");
const Schema = mongoose.Schema

const POST_MODEL_NAME = 'Post'

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
    required: true,
  }
}, {timestamps: true})

module.exports = {
  POST_MODEL_NAME,
  Post: mongoose.model(POST_MODEL_NAME, postSchema)
}


