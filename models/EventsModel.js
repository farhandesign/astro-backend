// Import Mongoose
const mongoose = require('mongoose');
const UsersModel = require('../models/UsersModel');

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
	},
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UsersModel'
	}
});

// Model
const EventsModel = mongoose.model('events', EventsSchema); // => ('collection name', Schema Name)

module.exports = EventsModel;
