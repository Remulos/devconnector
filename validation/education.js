// Server-side profile education input validator
// validator info at https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
	let errors = {};

	data.school = !isEmpty(data.school) ? data.school : '';
	data.degree = !isEmpty(data.degree) ? data.degree : '';
	data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
	data.from = !isEmpty(data.from) ? data.from : '';

	// School validation
	if (validator.isEmpty(data.school)) {
		errors.school = 'School name is required';
	}

	// Degree validation
	if (validator.isEmpty(data.degree)) {
		errors.degree = 'Degree name is required';
	}

	// fieldofstudy date validation
	if (validator.isEmpty(data.fieldofstudy)) {
		errors.fieldofstudy = 'Field of study is required';
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
