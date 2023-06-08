const {validationResult} = require("express-validator");
const {Post} = require("../models/post");
const path = require("path");
const {publicImagesPath} = require("../constants/publicImages");
const fs = require('fs/promises')

const fetchPost = async (req, res, next) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const e = new Error('Post not found')
      e.statusCode = 404
      throw e
    }
    req.post = post
    next()
  } catch (e) {
    next(e)
  }
}

const getPosts = async (req, res, next) => {
  try {
    let posts = await Post.find({}).exec()
    return res.status(200).json({posts})
  } catch (e) {
    next(e)
  }
}

const getPostById = async (req, res, next) => {
  try {
    const post =  req.post

    return res.status(200).json({
      post
    })
  } catch (e) {
    next(e)
  }
}

const createPost = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error(errors.toString())
    error.statusCode = 422
    throw error
  }
  const {title, content} = req.body
  const post = new Post({title, content, creator: {name: 'Dima'}, imageUrl: req?.file?.filename})
  try {
    await post.save()
    return res.status(201).json({
      message: 'created',
      post: {
        _id: new Date(),
        title,
        content,
        creator: {name: 'Dima'},
        createdAt: new Date()
      }
    })
  }
  catch (e) {
    next(e)
  }
}

const updatePost = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error(errors.toString())
    error.statusCode = 422
    throw error
  }
  const imageUrl = req.file?.filename
  try {
    const post = req.post
    if (!post) {
      const e = new Error('Post not found')
      e.statusCode = 404
      throw e
    }
    if (imageUrl && post.imageUrl) {
      const oldUrl = post.imageUrl
      await fs.unlink(path.join(process.cwd(), 'public', 'images', oldUrl))
      post.imageUrl = imageUrl
    }

    post.title = req.body.title
    post.description = req.body.description

    await post.save()

    return res.status(200).json({post})
  }
  catch (e) {
    next(e)
  }
}

const deletePost = async (req, res, next) => {
  const post = req.post
  try {
    await deleteImage(post.imageUrl)
    await Post.findByIdAndRemove(post._id)
    return res.status(200).json({
      message: 'deleted'
    })
  }
  catch (e) {
      next(e)
  }

}

const deleteImage = async (imageUrl) => {
  try {
    await fs.unlink(path.join(process.cwd(), 'public', 'images', imageUrl))
  } catch (e) {console.error(e)}
}

module.exports = {
  fetchPost,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
}
