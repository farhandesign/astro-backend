// Import Mongoose
const mongoose = require('mongoose');
const User = require('./UsersModel');

// Schema
const EventsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	eventImg: {
		type: String
	},
	eventDate: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		default: Date.now
	}
});

// Model
const EventsModel = mongoose.model('events', EventsSchema); // => ('collection name', Schema Name)

module.exports = EventsModel;
