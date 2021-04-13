const UsersModel = require('../models/UsersModel');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		const user = await UsersModel.create({
			firstName,
			lastName,
			email,
			password
		});
		sendToken(user, 201, res);
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorResponse('Please provide an email and password', 400));
	}

	try {
		const user = await UsersModel.findOne({ email }).select('+password');

		if (!user) {
			return next(new ErrorResponse('Invalid Credentials', 401));
		}
		const isMatch = await user.matchPasswords(password);

		if (!isMatch) {
			return next(new ErrorResponse('Invalid Credentials', 401));
		}

		sendToken(user, 200, res);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.forgotPassword = (req, res, next) => {
	res.send('Forgot Password Route');
};

exports.resetPassword = (req, res, next) => {
	res.send('Reset Password Route');
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();
	res.status(statusCode).json({ success: true, token });
};
