const express = require('express')
const {body} = require('express-validator')
const {User} = require('../models/user')
const authController = require('../controllers/auth')
const validateForm = require("../middlewares/validateForm");
const isAuthorized = require("../middlewares/isAuthorized");

const router = express.Router()

router.put('/signup', [
  body('email').isEmail().withMessage('Enter a valid Email')
  .custom(async (value, {req}) => {
    const user = await User.findOne({email: value})
    if (user) {
      return Promise.reject('E-mail already exists')
    }
  })
    .normalizeEmail(),
  body('password').trim().isLength({min: 5}),
  body('name').trim().not().isEmpty()
],
  validateForm,
  authController.signUp,
)

router.post('/login', authController.login)

router.route('/status')
  .get(isAuthorized, authController.getUserStatus)
  .put(isAuthorized, authController.updateUserStatus)

module.exports = router
