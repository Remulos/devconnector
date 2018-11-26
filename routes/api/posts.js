const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'post works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json(err));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json(err));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private

/*Saving the user name and avatar along with the post / comment isn't practical for a couple of very good reasons.

If the user ever changes their name or avatar (if you don't plan on using Gravatar's which I imagine most people taking this course won't be doing) it would be a nightmare having to traverse the entire posts collection updating that info for every post and comment where the user ID appears.

But more importantly, allowing a user to delete every piece of identifying information, other than functional records for accounting purposes etc, that you have stored on them is part of the new GDPR guidelines. So a similar messy delete procedure would apply as with the update above.

The sensible way to store these is just by storing the user id (as we are already doing) and then populating each post or comment with the current name and avatar data from the users collection.

You could still keep the desired functionality of not deleting posts or comments from users that delete their account by writing some logic to remove their name and any other identifying data from each post/comment entry upon account deletion - but leaving the actual comment intact.*/

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		// Check validation
		if (!isValid) {
			// If any errors return with 400 object
			return res.status(400).json(errors);
		}

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id,
		});

		newPost
			.save()
			.then(post => res.json(post))
			.catch(err => res.json(err));
	}
);

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id).then(post => {
				// Check that current user is owner of the post
				if (post.user.toString() !== req.user.id) {
					return res
						.status(401)
						.json({ notauthorised: 'User not Authorised' });
				}

				// Delete
				post.remove()
					.then(() => res.json({ success: true }))
					.catch(err =>
						res.status(404).json({ postnotfound: 'No post found.' })
					);
			});
		});
	}
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id).then(post => {
				if (
					post.likes.filter(
						like => like.user.toString() === req.user.id
					).length > 0
				) {
					return res
						.status(400)
						.json({ alreadyliked: 'User already liked this post' });
				}

				// Add user id to likes array
				post.likes.unshift({ user: req.user.id });

				post.save()
					.then(post => res.json(post))
					.catch(err => res.json(err));
			});
		});
	}
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
	'/unlike/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id).then(post => {
				if (
					post.likes.filter(
						like => like.user.toString() === req.user.id
					).length === 0
				) {
					return res
						.status(400)
						.json({ notliked: 'You have not yet liked this post' });
				}

				// Get remove index
				const removeIndex = post.likes
					.map(item => item.user.toString())
					.indexOf(req.user.id);

				post.likes.splice(removeIndex, 1);

				post.save()
					.then(post => res.json(post))
					.catch(err => res.json(err));
			});
		});
	}
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
	'/comment/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		// Check validation
		if (!isValid) {
			// If any errors return with 400 object
			return res.status(400).json(errors);
		}

		Post.findById(req.params.id).then(post => {
			const newComment = {
				text: req.body.text,
				name: req.user.name,
				avatar: req.user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);

			post.save()
				.then(post => res.json(post))
				.catch(err =>
					res.status(404).json({ nopost: 'Post not found' })
				);
		});
	}
);

// @route   DELETE posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
	'/comment/:id/:comment_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findById(req.params.id)
			.then(post => {
				if (
					post.comments.filter(
						comment =>
							comment._id.toString() === req.params.comment_id
					).length === 0
				) {
					return res
						.status(404)
						.json({ nocomment: 'Comment does not exist.' });
				}

				const removeIndex = post.comment
					.map(item => item._id.toString())
					.indexOf(req.params.comment_id);

				post.comments.splice(removeIndex, 1);

				post.save()
					.then(post => res.json(post))
					.catch(err =>
						res.status(404).json({ nopost: 'Post not found' })
					);
			})
			.catch(err =>
				res.status(404).json({ nopost: 'Post is not found' })
			);
	}
);

module.exports = router;
