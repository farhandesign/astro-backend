// Route for Events Page
const express = require('express');
const router = express.Router();
const EventsModel = require('../models/EventsModel');

// Get All the Events
router.get('/', async (req, res) => {
	try {
		const events = await EventsModel.find();
		res.send(events);
	} catch (err) {
		res.json({ message: err });
	}
});

// Get a Specific Event
router.get('/:eventId', async (req, res) => {
	try {
		const event = await EventsModel.findById(req.params.eventId);
		res.send(event);
	} catch (err) {
		res.json({ message: err });
	}
});

// Delete An Event
router.delete('/:eventId', async (req, res) => {
	try {
		const removedEvent = await EventsModel.remove({ _id: req.params.eventId });
		res.send(removedEvent);
	} catch (err) {
		res.json({ message: err });
	}
});

// Update An Event
router.patch('/:eventId', async (req, res) => {
	try {
		const updatedEvent = await EventsModel.updateOne(
			{ _id: req.params.eventId },
			{
				$set: {
					description: req.body.description,
					address: req.body.address,
					eventImg: req.body.eventImg,
					eventDate: req.body.eventDate
				}
			}
		);
		res.send(updatedEvent);
	} catch (err) {}
});

module.exports = router;
