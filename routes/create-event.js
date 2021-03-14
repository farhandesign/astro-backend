// Route for Events Page
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth');

const EventsModel = require('../models/EventsModel');

// GET
router.get('/', authorize, (req, res) => {
	res.send('<h1>Create Events Page</h1>');
});

// POST
router.post('/', (req, res) => {
	const formData = {
		name: req.body.name,
		description: req.body.description,
		address: req.body.address,
		eventImg: req.body.eventImg,
		eventDate: req.body.eventDate
	};

	const newEventsModel = new EventsModel(formData);

	newEventModel
		.save()
		.then((dbDocument) => {
			res.send(dbDocument);
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;
