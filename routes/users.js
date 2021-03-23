// Import
const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
// to read the jsonwebtoken
const secret = process.env.SECRET;

const UsersModel = require('../models/UsersModel');

// SIGN-UP
router.post('/signup', (req, res) => {
	// 1) Capture user account details (e.g first name, last name, etc.)
	const formData = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password
	};

	// 2) Create newUsersModel for saving the collection
	const newUsersModel = new UsersModel(formData);

	// 3) Check that no other docuement has the same email
	UsersModel.findOne({ email: formData.email }).then((dbDocument) => {
		// 3.1) If email exists
		if (dbDocument) {
			// then reject registeration
			res.send('Sorry. An account with that email already exists');
		} else {
			//4) Generate Salt
			bcryptjs.genSalt((err, theSalt) => {
				// 5) With the salt and user's password, encrypt
				bcryptjs.hash(formData.password, theSalt, (err, theEncryption) => {
					// 6) Replace the password with encryption
					newUsersModel.password = theEncryption;

					// 7) Save user to collection
					newUsersModel
						.save()
						.then(() => {
							res.send('Account Created Successfully!');
						})
						.catch((error) => {
							console.log(error);
						});
				});
			});
		}
	});
});

// LOGIN
router.post('/login', async (req, res) => {
	// npm packages: passport, passport-jwt, jsonwebtoken

	// Step 1. Capture formData (email & password)
	const formData = {
		email: req.body.email,
		password: req.body.password
	};

	// Step 2a. In database, find account that matches email
	UsersModel.findOne({ email: formData.email }, (err, document) => {
		// Step 2b. If email NOT match, reject the login request
		if (!document) {
			res.json({ message: 'Please check email or password' });
		} else {
			// Step 3. If there's matching email, examine the document's password
			// Step 4. Compare the encrypted password in db with incoming password
			bcryptjs.compare(formData.password, document.password).then((isMatch) => {
				// Step 5a. If the password matches, generate web token (JWT)
				if (isMatch === true) {
					// Step 6. Send the JWT to the client
					const payload = {
						id: document.id,
						email: document.email
					};

					jwt.sign(payload, secret, (err, jsonwebtoken) => {
						res.json({
							message: 'Login successful',
							jsonwebtoken: jsonwebtoken
						});
					});
				} else {
					// Step 5b. If password NOT match, reject login request
					res.json({ message: 'Please check email or password' });
				}
			});
		}
	});

	// // LETS VALIDATE THE DATA BEFORE WE SUBMIT A USER
	// const { error } = loginValidation(req.body);
	// if (error) {
	// 	return res.status(400).send(error.details[0].message);
	// }

	// // Check if Email Exists
	// const user = await UsersModel.findOne({ email: req.body.email });
	// if (!user) {
	// 	return res.status(400).send('Wrond Email or Password');
	// }
	// // Check if Password is Correct
	// const validPass = await bcryptjs.compare(req.body.password, user.password);
	// if (!validPass) {
	// 	return res.status(400).send('Wrong Email or Password');
	// }

	// // Create and Assign A JSON WEB TOKEN
	// const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	// res.header('auth-token', token).send('Successfully Logged in!');
});

module.exports = router;
