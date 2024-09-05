const express = require('express');
const app = express();
const PORT = 8080;

// Import middleware
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const requestTimeMiddleware = require('./middlewares/requestTimeMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Import routes
const indexRouter = require('./routes/index');

// Use middleware
app.use(loggerMiddleware); 
app.use(requestTimeMiddleware); 

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine
app.set('view engine', 'ejs');


// Serve static files from 'public' directory
app.use(express.static('public'));

// Use routes
app.use('/', indexRouter);

// Error handling middleware (must be after all routes)
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
