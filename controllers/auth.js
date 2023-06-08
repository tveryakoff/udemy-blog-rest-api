const {User} = require('../models/user')
const bcrypt = require('bcryptjs')

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

module.exports = {
  signUp
}
