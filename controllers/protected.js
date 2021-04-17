exports.getPrivateData = (req, res, next) => {
	res.status(200).json({
		success: true,
		user: 'You got access to the private data in this route'
	});
};
