// Import Mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Schema
const UsersSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [ true, 'Please provide first name' ]
	},
	lastName: {
		type: String,
		required: [ true, 'Please provide last name' ]
	},
	email: {
		type: String,
		required: [ true, 'Please provide an email' ],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email'
		]
	},
	password: {
		type: String,
		required: [ true, 'Please provide a password' ],
		minlength: 6,
		select: false
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date
});

UsersSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UsersSchema.methods.matchPasswords = async function(password) {
	return await bcrypt.compare(password, this.password);
};

UsersSchema.methods.getSignedToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Model
const UsersModel = mongoose.model('users', UsersSchema); // => ('collection', SchemaName)

module.exports = UsersModel;
