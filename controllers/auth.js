const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signUp = async (req, res, next) => {
  try {
    const {name, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      password: hashedPassword,
      name
    })

    const result = await user.save()
    return res.status(201).json({userId: result?._id, message: 'created'})
  }
  catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if (!user) {
      const e = new Error('User not found')
      e.statusCode = 401
      throw(e)
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      const e = new Error('Password is not correct')
      e.statusCode = 401
      throw(e)
    }
    const token = jwt.sign({email: user.email, userId: user._id.toString()}, 'sectetOrPrivateKey', {expiresIn: '1h'})
    return res.status(200).json({userId: user._id, token})
  } catch (e) {
    next(e)
  }
}

const getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const e = new Error('Not authorized')
      e.statusCode = 401
      throw e
    }
    return res.status(200).json({status: user.status})
  } catch (e) {
    next(e)
  }
}

const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const e = new Error('Not authorized')
      e.statusCode = 401
      throw e
    }
    const {status} = req.body
    user.status = status
    await user.save()
    return res.status(200).json({message: 'success'})
  } catch (e) {
    next(e)
  }
}

module.exports = {
  login,
  signUp,
  getUserStatus,
  updateUserStatus,
}
