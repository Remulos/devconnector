// Server-side Login input validator
// validator info at https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
	let errors = {};

	data.text = !isEmpty(data.text) ? data.text : '';

	if (!validator.isLength(data.text, { min: 2, max: 300 })) {
		errors.text = 'Text must be between 2 and 300 characters';
	}

	if (validator.isEmpty(data.text)) {
		errors.text = 'Text field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
