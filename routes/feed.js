const express = require('express')
const feedController = require('../controllers/feed')
const {createPostValidators} = require("../validators/feed");
const {publicImagesPath} = require("../constants/publicImages");
const {storage, fileImageFilter} = require('../services/FileStorege')
const multer = require('multer')
const isAuthorized = require("../middlewares/isAuthorized");

const router  = express.Router()

router.param('postId', feedController.fetchPost)

router.route('/posts')
  .get(isAuthorized, feedController.getPosts)
  .post(isAuthorized, multer({storage: storage(publicImagesPath), fileFilter: fileImageFilter}).single('image'),
    feedController.createPost)

router.route('/posts/:postId')
  .get(isAuthorized, feedController.getPostById)
  .put(isAuthorized, multer({storage: storage(publicImagesPath), fileFilter: fileImageFilter}).single('image'), feedController.updatePost)
  .delete(isAuthorized, feedController.deletePost)


module.exports = router
