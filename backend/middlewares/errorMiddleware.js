import AppError from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);

    // Default status and message
    let { statusCode, message } = err;

    // Handle specific error cases
    if (!statusCode) statusCode = 500; // Internal Server Error
    if (!message) message = 'Something went wrong!';

    res.status(statusCode).json({
        success: false,
        message,
        error: err.stack, // Include stack trace in development mode
    });
};

export { errorMiddleware, AppError };