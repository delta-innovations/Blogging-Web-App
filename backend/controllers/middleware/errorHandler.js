const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = 500;
    let errorResponse = {
        error: 'Something went wrong',
        message: 'Internal server error',
    };

    // Validation Errors (e.g., Mongoose Schema Validation)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorResponse = {
            error: 'Validation Error',
            message: err.message,
        };
    }

    // JWT Errors (Invalid or Expired Token)
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorResponse = {
            error: 'Authentication Error',
            message: 'Invalid token',
        };
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorResponse = {
            error: 'Authentication Error',
            message: 'Token has expired, please log in again',
        };
    }

    // MongoDB Duplicate Key Error (e.g., duplicate email)
    else if (err.code === 11000) {
        statusCode = 409; // Conflict
        errorResponse = {
            error: 'Duplicate Key Error',
            message: `A user with that ${Object.keys(err.keyValue)} already exists`,
        };
    }

    // Rate Limiting Errors
    else if (err.name === 'RateLimitError') {
        statusCode = 429; // Too Many Requests
        errorResponse = {
            error: 'Rate Limit Exceeded',
            message: 'Too many requests, please try again later',
        };
    }

    // Send Stack Trace in Development Mode
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;