const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.user_register = (req, res) => {
	const { username, email, password, pwd_repeat, firstname, lastname } = req.body;
	const errors = [];

	// Check required fileds
	if (!username || !email || !password || !pwd_repeat) {
		errors.push({msg: 'Please fill in all fields' });
	}

	// Check passwords match
	if (password != pwd_repeat) {
		errors.push({ msg: 'Passwords do not match' });
	}

	// Check pwd length
	if (password.length < 6) {
		errors.push({ msg: 'Password should be at least 6 characters' });
	}

	if (errors.length > 0) {
		console.log(errors);
		res.render('register', {
			errors,
			username,
			firstname,
			lastname,
			email,
			pwd
		});
	} else {
		// Validation pass
		User.findOne({ email: email }).then(user => {
				if(user) {
					// User exists
					errors.push({msg: 'Email already Registered'});
					res.render('register', {
						errors,
						username,
						email,
						firstname,
						lastname
					});
				} else {
					// Validation pass
					const newUser = new User({
						_id: new mongoose.Types.ObjectId(),
						username,
						email,
						firstname,
						lastname,
						password,
					});
					// Hash pwd
					bcrypt.genSalt(10,(err, salt) =>
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							// Set pwd to hashed
							newUser.password = hash;
							// Save user
							newUser.save()
								.then(user => {
									req.flash('success_msg', 'You are now registered and can log in');
									res.redirect('/users/login');
								})
								.catch(err => console.log(err));
						}));
				}
			});
	}
}

exports.user_login = (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
}

exports.user_logout = (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
}