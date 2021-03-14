// Import Packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const createEventRouter = require('./routes/create-event');
const usersRouter = require('./routes/users');

// Create Server Obj
const server = express();

// Connect to DB using mongoose
const connectionString = process.env.DB_URL;

const connectionConfig = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};
mongoose
	.connect(connectionString, connectionConfig)
	.then(() => {
		console.log('DB is connected');
	})
	.catch(() => {
		console.log('error occured', error);
	});

// Tell Express how to use body-parser
server.use(bodyParser.urlencoded({ extended: false }));
// Tell express to recognize JSON
server.use(bodyParser.json());

// Route
server.get('/', (req, res) => {
	res.send('<h1>Welcome To Events Website</h1>');
});

// Use Events Routes
server.use('/create-event', createEventRouter);
// Use Users Routes
server.use('/users', usersRouter);

// Use Heroku port number if it exits otherwise use 3500
const port = process.env.PORT || 3500;
server.listen(port, () => {
	console.log('Server running on port 3500');
});
