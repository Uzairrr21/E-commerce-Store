const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  const response = {
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)) 
    }),
  };

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    response.message = 'Validation failed';
    response.errors = {};
    for (const field in err.errors) {
      response.errors[field] = err.errors[field].message;
    }
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    response.message = 'Duplicate field value entered';
    response.fields = err.keyValue;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    response.message = `Invalid ${err.path}: ${err.value}`;
  }

  res.json(response);
};

module.exports = { notFound, errorHandler };