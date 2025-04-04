const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// const rateLimit = require('express-rate-limit');

//defined body parser and cors
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
const connectDb = require('./db/db')
dotenv.config();

//import dotenv 
const app = express();

connectDb();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//middle ware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

//routing middleware
const authRoutes = require('./routes/authRoutes');

//use routes
app.use('/api/auth', authRoutes);
//use rate limiter

//health check api endpoint
app.get('/', (req, res) => {
    res.send('Server is running');
});
//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//404 handler
app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});



const port = process.env.PORT || 5000;

//listen server on the port
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})


//Graceful shutdown
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });