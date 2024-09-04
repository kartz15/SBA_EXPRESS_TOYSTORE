// middlewares/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send('Something broke!'); // Send a 500 status with a custom message
};

module.exports = errorMiddleware;
