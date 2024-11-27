class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace excluding constructor
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;