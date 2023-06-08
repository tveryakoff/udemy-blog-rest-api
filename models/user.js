const mongoose = require('mongoose')
const {POST_MODEL_NAME} = require("./post");
const Schema = mongoose.Schema

const USER_MODEL_NAME = 'User'

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'I am new'
  },
  posts: [
    {type: Schema.Types.ObjectId, ref: POST_MODEL_NAME}
  ]
})

module.exports = {User: mongoose.model(USER_MODEL_NAME, userSchema), USER_MODEL_NAME}
