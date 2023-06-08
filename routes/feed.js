const express = require('express')
const feedController = require('../controllers/feed')
const {createPostValidators} = require("../validators/feed");
const {publicImagesPath} = require("../constants/publicImages");
const {storage, fileImageFilter} = require('../services/FileStorege')
const multer = require('multer')

const router  = express.Router()

router.param('postId', feedController.fetchPost)

router.route('/posts')
  .get(feedController.getPosts)
  .post(multer({storage: storage(publicImagesPath), fileFilter: fileImageFilter}).single('image'),
    feedController.createPost)

router.route('/posts/:postId')
  .get(feedController.getPostById)
  .put(multer({storage: storage(publicImagesPath), fileFilter: fileImageFilter}).single('image'), feedController.updatePost)
  .delete(feedController.deletePost)

module.exports = router
