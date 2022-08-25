const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');
const errors = require("./middleware/errorHandler");
const RateLimiterIp = require("./middleware/rate_limit_IP");
const RateLimiterToken = require("./middleware/rate_limit_Token");


const app = express();
app.use(express.json());

// MongoDB connection, success and error event responses
mongoose.connect('mongodb+srv://tazii:brunnotte@cluster0.fhnseva.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(() => console.log('Failed to connect to MongoDB !'));

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json())
app.use(RateLimiterIp);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use(RateLimiterToken);
app.use(errors.errorHandler); // middleware for error responses


module.exports = app;