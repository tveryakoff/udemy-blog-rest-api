const {validationResult} = require("express-validator");

const validateForm = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error(errors.toString())
    error.statusCode = 422
    next(error)
  }
  next()
}

module.exports = validateForm
