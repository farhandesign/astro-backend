// Route for Events Page
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
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

// Go To Create An Event Page
router.get('/create-event', (req, res) => {
	res.send('<h1>Create Events Page</h1>');
});

// Create An Event POST
router.post('/create-event', async (req, res) => {
	const formData = {
		name: req.body.name,
		description: req.body.description,
		address: req.body.address,
		eventDate: req.body.eventDate,
		authorId: req.user
	};
	// Create newEventsModel for saving the collection
	const newEventsModel = new EventsModel(formData);

	// Upload Events Image if files were sent
	if (Object.values(req.files).length > 0) {
		const files = Object.values(req.files);

		// Image
		await cloudinary.uploader.upload(files[0].path, (cloudinaryErr, cloudinaryResult) => {
			if (cloudinaryErr) {
				console.log(cloudinaryErr);
			}
			// Add the URL of the image to newEventsModel
			newEventsModel.eventImg = cloudinaryResult.url;
		});
	}

	// Save Event to Collection
	newEventsModel
		.save()
		.then((dbDocument) => {
			res.status(201).send(dbDocument);
		})
		.catch((error) => {
			res.status(409).json({ message: error.message });
		});
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
