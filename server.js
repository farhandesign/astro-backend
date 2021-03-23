// Import Packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressFormData = require('express-form-data');
const cors = require('cors');
require('dotenv').config();
const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
// Create Server Obj
const server = express();

//****************
// Import passport
const passport = require('passport');
// Import the strategies & way to extract the jsonwebtoken
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// The same secret in routes/UsersRoutes will be needed
// to read the jsonwebtoken
const secret = process.env.SECRET;

// Options for passport-jwt
const passportJwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secret
};

// This function is what will read the contents (payload) of the jsonwebtoken
const passportJwt = (passport) => {
	passport.use(
		new JwtStrategy(passportJwtOptions, (jwtPayload, done) => {
			// Extract and find the user by their id (contained jwt)
			UsersModel.findOne({ _id: jwtPayload.id })
				.then(
					// If the document was found
					(document) => {
						return done(null, document);
					}
				)
				.catch(
					// If something went wrong with database search
					(err) => {
						return done(null, null);
					}
				);
		})
	);
};

// Invoke passportJwt and pass the passport npm package as argument
passportJwt(passport);
// *****************

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

// Use Events Routes
server.use('/events', eventsRouter);
// Use Users Routes
server.use('/users', usersRouter);

// Use Heroku port number if it exits otherwise use 3500
const port = process.env.PORT || 3500;
server.listen(port, () => {
	console.log('Server running on port 3500');
});
