// Server-side Profile creation/editing input validator
// validator info at https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';

	// Validate handle
	if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
		errors.handle = 'Handle needs to be between 2 and 40 characters.';
	}
	if (validator.isEmpty(data.handle)) {
		errors.handle = 'Handle is required';
	}

	// Validate status
	if (validator.isEmpty(data.status)) {
		errors.status = 'Status field is required';
	}

	// Validate skills
	if (validator.isEmpty(data.skills)) {
		errors.skills = 'Skills field is required';
	}

	// Validate website
	if (!isEmpty(data.website)) {
		if (!validator.isURL(data.website)) {
			errors.website = 'Not a valid URL';
		}
	}

	// Validate facebook
	if (!isEmpty(data.facebook)) {
		if (!validator.isURL(data.facebook)) {
			errors.facebook = 'Not a valid URL';
		}
	}

	// Validate youtube
	if (!isEmpty(data.youtube)) {
		if (!validator.isURL(data.youtube)) {
			errors.youtube = 'Not a valid URL';
		}
	}

	// Validate twitter
	if (!isEmpty(data.twitter)) {
		if (!validator.isURL(data.twitter)) {
			errors.twitter = 'Not a valid URL';
		}
	}

	// Validate instagram
	if (!isEmpty(data.instagram)) {
		if (!validator.isURL(data.instagram)) {
			errors.instagram = 'Not a valid URL';
		}
	}

	// Validate linkedin
	if (!isEmpty(data.linkedin)) {
		if (!validator.isURL(data.linkedin)) {
			errors.linkedin = 'Not a valid URL';
		}
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
