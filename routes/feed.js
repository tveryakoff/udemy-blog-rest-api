const express = require('express')
const feedController = require('../controllers/feed')
const {createPostValidators} = require("../validators/feed");

const router  = express.Router()

router.get('/posts', feedController.getPosts);
router.get('/posts/:postId', feedController.getPostById)
router.post('/posts', createPostValidators, feedController.createPost)

module.exports = router
