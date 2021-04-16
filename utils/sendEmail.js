const nodemailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');

const sendEmail = (options) => {
	const transporter = nodemailer.createTransport(
		smtp({
			host: 'in-v3.mailjet.com',
			port: 2525,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		})
	);
	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.text
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
};

module.exports = sendEmail;
