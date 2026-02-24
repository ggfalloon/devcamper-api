const express = require('express');
const path = require('path');

const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
// const mongoSanitize = require('express-mongo-sanitize');
const mongoSanitize = require('mongo-sanitize');

const helmet = require('helmet');
// const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const app = express();

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

app.set('query parser', 'extended');

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Santize data
// app.use(mongoSanitize());
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize(req.body);
    if (req.params) req.params = mongoSanitize(req.params);
  
    // DO NOT assign to req.query
    // Instead sanitize individual properties if needed
  
    next();
  });

// Set security headers
app.use(helmet());

// Prevent cross site sripting attacks
// app.use(xss());

// Rate Limiting
const limiter = rateLimit({
    windowMS: 10 * 60 * 1000, // 10 mins
    max: 10
})
app.use(limiter);

// Prevent http param polution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
})