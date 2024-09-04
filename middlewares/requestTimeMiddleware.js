// middlewares/requestTimeMiddleware.js

const requestTimeMiddleware = (req, res, next) => {
    req.requestTime = new Date();
    next(); // Pass control to the next middleware
};

module.exports = requestTimeMiddleware;
