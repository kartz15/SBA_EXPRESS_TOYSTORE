// middlewares/loggerMiddleware.js

const loggerMiddleware = (req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next(); // Pass control to the next middleware
};

module.exports = loggerMiddleware;
