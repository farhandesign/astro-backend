// Route for Events Page
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const EventsModel = require('../models/EventsModel');

// Get 6 Events
router.get('/', async (req, res) => {
	try {
		const events = await EventsModel.find().sort({ $natural: -1 }).limit(6);
		res.send(events);
	} catch (err) {
		res.json({ message: err });
	}
});

// Get all Events
router.get('/all', async (req, res) => {
	try {
		const events = await EventsModel.find().sort({ $natural: -1 });
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
		host: req.body.host,
		description: req.body.description,
		address: req.body.address,
		eventDate: req.body.eventDate,
		price: req.body.price,
		time: req.body.time,
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
router.delete('/delete/:eventId', async (req, res) => {
	try {
		const removedEvent = await EventsModel.deleteOne({ _id: req.params.eventId });
		res.send(removedEvent);
	} catch (err) {
		res.json({ message: err });
	}
});

// Update An Event
router.patch('/update/:eventId', async (req, res) => {
	try {
		const updatedEvent = await EventsModel.updateOne(
			{ _id: req.params.eventId },
			{
				$set: {
					name: req.body.name,
					host: req.body.host,
					description: req.body.description,
					address: req.body.address,
					price: req.body.price,
					eventDate: req.body.eventDate,
					time: req.body.time
				}
			}
		);
		res.send(updatedEvent);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
