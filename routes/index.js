const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Render ejs view pages
router.get('/', (req, res) => { res.render('welcome') });
router.get('/profiles', (req, res) => { res.render('profiles') });
router.get('/chats', (req, res) => res.render('chats'));
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
	res.render('dashboard', {
		name: req.user.username,
		pp: req.user.profileImages.image1
	}));

module.exports = router;