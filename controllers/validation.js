// VALIDATION, TO VALIDATE THE INCOMING DATA BEFORE SUBMITTING
const Joi = require('joi');

// Singup Validation
const signupValidation = (data) => {
	const joiSchema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().min(6).required()
	});
	return joiSchema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
	const joiSchema = Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().min(6).required()
	});
	return joiSchema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;

// // LETS VALIDATE THE DATA BEFORE WE SUBMIT A USER
// const { error } = joiSchema.validate(req.body);
// if (error) {
// 	return res.status(400).send(error.details[0].message);
// }
