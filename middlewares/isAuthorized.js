const jwt = require('jsonwebtoken')
const JwtPrivateKeySecret = require('../constants/jwtPrivateKey')

const isAuthorized = (req, res, next) => {
  const token = req.get('Authorization')?.split?.(' ')?.[1]
  if (!token) {
    const e = new Error('Not authorized')
    e.statusCode = 401
    throw e
  }
  try {
    const decodedToken = jwt.verify(token, JwtPrivateKeySecret)
    if (!decodedToken) {
      const e = new Error('Not authorized')
      e.statusCode = 401
      throw e
    }

    const {userId} = decodedToken
    req.userId = userId
    next()
  } catch (e) {
    next(e)
  }
}

module.exports = isAuthorized
