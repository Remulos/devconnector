const keys = require('../../config/keys');
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');

// bcryptjs - https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');

// jwt i.e. jsonwebtoken https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'user works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			res.status(400).json({ email: 'Email already exists' });
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				default: 'mm',
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				avatar,
			});

			// bcrypt.genSalt(rounds=, seed_length=, callback)
			// Asynchronously generates a salt.
			bcrypt.genSalt(10, (err, salt) => {
				// bcrypt.hash(s, salt, callback, progressCallback=)
				// Asynchronously generates a hash for the given string.
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	// Find user by email
	User.findOne({ email }).then(user => {
		// Check for user
		if (!user) {
			return res.status(404).json({ email: 'User not found' });
		}

		// Check Password
		// bcrypt.compare(s, hash, callback, progressCallback=)
		// Asynchronously compares the given data against the given hash.
		bcrypt
			.compare(password, user.password)
			.then(isMatch => {
				if (isMatch) {
					// Create jwt payload
					const payload = {
						id: user.id,
						name: user.name,
						avatar: user.avatar,
					};

					// Sign token
					//jwt.sign(payload, secretOrKey,[options, callback])
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: '1h' },
						(err, token) => {
							res.json({
								success: true,
								token: 'Bearer ' + token,
							});
						}
					);
				} else {
					return res
						.status(400)
						.json({ passowrd: 'Password incorrect' });
				}
			})
			.catch(err => console.log(err));
	});
});

module.exports = router;
