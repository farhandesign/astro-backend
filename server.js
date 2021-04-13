// Import Packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressFormData = require('express-form-data');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const errorHandler = require('./middleware/error');

const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
// Create Server Obj
const server = express();

// Connect to DB using mongoose
const connectionString = process.env.DB_URL;

const connectionConfig = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: true
};
mongoose
	.connect(connectionString, connectionConfig)
	.then(() => {
		console.log('DB is connected');
	})
	.catch(() => {
		console.log('error occured', error);
	});

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});

// ****************
// MIDDLEWARE
// ****************
// Tell express  to allow CORS (cross origin resource sharing)
server.use(cors());
// Tell Express how to use body-parser
server.use(bodyParser.urlencoded({ extended: false }));
// Tell express to recognize JSON
server.use(bodyParser.json());
//Tell express to read HTTP form data
server.use(expressFormData.parse());

// Route
server.get('/', (req, res) => {
	res.send('<h1>Welcome To Events Website</h1>');
});

// Use Auth Routes
server.use('/api/auth', require('./routes/auth'));
server.use('/api/private', require('./routes/protectedRoute'));

// Use Events Routes
server.use('/events', eventsRouter);
// Use Users Routes
server.use('/users', usersRouter);

// Error Handler (Should be last piece of middleware)
server.use(errorHandler);

// Use Heroku port number if it exits otherwise use 3500
const port = process.env.PORT || 3500;
server.listen(port, () => {
	console.log('Server running on port 3500');
});
