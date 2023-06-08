const express = require('express')
const feedController = require('../controllers/feed')
const {createPostValidators} = require("../validators/feed");
const {publicImagesPath} = require("../constants/publicImages");
const {storage, fileImageFilter} = require('../services/FileStorege')
const multer = require('multer')


const router  = express.Router()

router.get('/posts', feedController.getPosts);
router.get('/posts/:postId', feedController.getPostById)
router.post(
  '/posts',
  multer({storage: storage(publicImagesPath), fileFilter: fileImageFilter}).single('image'),
  feedController.createPost
)
router.put('/posts/:postId',multer({storage: storage(publicImagesPath), fileFilter: fileImageFilter}).single('image'), feedController.updatePost)
router.delete('/posts/:postId', feedController.deletePost)
module.exports = router
