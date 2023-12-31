function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Internal Server Error";
  switch (err.name) {
    case "SequelizeValidationError":
      const error = err.errors[0].message;
      status = 400;
      message = error;
      break;
    case "SequelizeUniqueConstraintError":
      status = 400;
      message = err.errors[0].message;
      break;
    case "Invalid credentials":
      status = 401;
      message = "invalid username or email or password";
      break;
    case "not found":
      status = 404;
      message = "error not found";
      break;
    case "JsonWebTokenError":
      status = 401;
      message = "Invalid Token";
      break;
    case "forbidden":
      status = 403;
      message = "Forbidden";
      break;
    case "same status":
      status = 400;
      message = `Status is already ${err.status}`;
      break;
    case "invalid_status":
      status = 400;
      message = "Invalid status";
      break;
  }

  res.status(status).json({ message });
}

module.exports = errorHandler;
