function errorHandler(err, req, res, next) {
  let status = 500;
  let message = 'Internal Server Error';
  switch (err.name) {
    case 'SequelizeValidationError':
      const error = err.errors.map(el => el.message)
      status = 400;
      message = error
      break;
    case 'SequelizeUniqueConstraintError':
      status = 400;
      message = 'Email already exists';
      break;
    case 'Invalid credentials':
      status = 401;
      message = 'invalid username or email or password'
      break;
    case 'not found':
      status = 404;
      message = 'error not found'
  }

  res.status(status).json({ message })
}

module.exports = errorHandler