// Import Mongoose
const mongoose = require('mongoose');

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
	}
});

// Model
const EventsModel = mongoose.model('events', EventsSchema); // => ('collection name', Schema Name)

module.exports = EventsModel;
