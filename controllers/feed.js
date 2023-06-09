const {validationResult} = require("express-validator");
const {Post} = require("../models/post");
const path = require("path");
const {publicImagesPath} = require("../constants/publicImages");
const fs = require('fs/promises')
const {User} = require("../models/user");

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
    let totalItems = await Post.find({}).countDocuments()
    const currentPage = req.query.page || 1
    const perPage = 2
    const posts = await Post.find().skip((currentPage - 1) * perPage).limit(perPage)
    return res.status(200).json({posts, totalItems})
  } catch (e) {
    next(e)
  }
}

const getPostById = async (req, res, next) => {
  try {
    const post = req.post

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
  const post = new Post({title, content, imageUrl: req?.file?.filename, creator: req.userId})
  try {
    await post.save()
    const user = await User.findById(req.userId)
    if (!user) {
      throw new Error('No user found')
    }
    user.posts.push(post)
    await user.save()
    return res.status(201).json({
      message: 'created',
      post: {
        _id: new Date(),
        title,
        content,
        creator: user,
        createdAt: new Date()
      }
    })
  } catch (e) {
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
    if (post.creator.toString() !== req.userId) {
      const e = new Error('Deleting not allowed')
      e.statusCode = 403
      throw e
    }
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
  } catch (e) {
    next(e)
  }
}

const deletePost = async (req, res, next) => {
  const post = req.post
  try {
    if (post.creator.toString() !== req.userId) {
      const e = new Error('Deleting not allowed')
      e.statusCode = 403
      throw e
    }

    await deleteImage(post.imageUrl)
    await Post.findByIdAndRemove(post._id)
    return res.status(200).json({
      message: 'deleted'
    })
  } catch (e) {
    next(e)
  }

}

const deleteImage = async (imageUrl) => {
  try {
    await fs.unlink(path.join(process.cwd(), 'public', 'images', imageUrl))
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  fetchPost,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
}
