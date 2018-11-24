// Server-side Login input validator
// validator info at https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	// Email validation
	if (!validator.isEmail(data.email)) {
		errors.email = 'Not a valid email';
	}

	if (validator.isEmpty(data.email)) {
		errors.email = 'Email is required';
	}

	// Password validation
	if (validator.isEmpty(data.password)) {
		errors.password = 'Password is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
