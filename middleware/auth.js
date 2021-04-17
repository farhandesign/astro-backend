const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		// its gonna look like Bearer 2hjlsdoiapsdj , so we split and grab the second part which is the token
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new ErrorResponse('Not authorized to access this route', 401));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await UsersModel.findById(decoded.id);

		if (!user) {
			return next(new ErrorResponse('No user found with this id', 404));
		}

		req.user = user;
		res.status(200).send(user);
		next();
	} catch (error) {
		return next(new ErrorResponse('Not authorized', 401));
	}
};
