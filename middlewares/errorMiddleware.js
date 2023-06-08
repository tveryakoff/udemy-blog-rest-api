const errorMiddleware = (error, req, res, next) => {
  const {message, statusCode = 500} = error
  console.error('error', error)
  return res.status(statusCode).json({
    message,
    statusCode,
  })
}

module.exports = errorMiddleware
