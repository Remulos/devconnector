// Server-side profile experience input validator
// validator info at https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.company = !isEmpty(data.company) ? data.company : '';
	data.from = !isEmpty(data.from) ? data.from : '';

	// Title validation
	if (validator.isEmpty(data.title)) {
		errors.title = 'Job title is required';
	}

	// Company validation
	if (validator.isEmpty(data.company)) {
		errors.company = 'Company name is required';
	}

	// From date validation
	if (validator.isEmpty(data.from)) {
		errors.from = 'Start date is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
