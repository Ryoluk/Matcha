const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Likes = require('../models/Likes');
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const storage = require('../config/fileStorage');
const upload = multer({
	storage: storage.storage,
	limits: storage.limits,
	fileFilter: storage.fileFilter,
});

// Render ejs view pages
router.get('/', (req, res) => { res.render('welcome') });

router.get('/profiles/:id', (req, res) => {
	const id = req.params.id;
	User.findById(id)
	.exec()
	.then( doc => {
		Likes.findOne({$and: [{_userId: req.user.id}, {likedId: id}]}, (err) => {
			if (err) {
					req.flash('error_msg', err.message);
					console.log("err" + err);
					res.status(500).redirect('/profiles/' + id);
				}
		})
		.exec()
		.then((likeDoc) => {
			console.log(likeDoc);
			if (likeDoc) {
				res.render('profiles', {
					"user": doc,
					"liked": "unlike"
				});
			}
			else {
				res.render('profiles', {
					"user": doc,
					"liked": "like"
				});
			}
		})
	})
	.catch();
});

router.get('/chats', (req, res) => res.render('chats'));

router.get('/suggestedMatchas', (req, res) => {
	User.find({$and:[{
		city: req.user.city
	},{$or:[{
		"interests.first":{$in:[req.user.interests['first'],req.user.interests['second'],req.user.interests['third'],req.user.interests['fourth'],req.user.interests['fifth']]},
	}, {
		"interests.second":{$in:[req.user.interests['first'],req.user.interests['second'],req.user.interests['third'],req.user.interests['fourth'],req.user.interests['fifth']]},
	}, {
		"interests.third":{$in:[req.user.interests['first'],req.user.interests['second'],req.user.interests['third'],req.user.interests['fourth'],req.user.interests['fifth']]},
	}, {
		"interests.fourth":{$in:[req.user.interests['first'],req.user.interests['second'],req.user.interests['third'],req.user.interests['fourth'],req.user.interests['fifth']]},
	}, {
		"interests.fifth":{$in:[req.user.interests['first'],req.user.interests['second'],req.user.interests['third'],req.user.interests['fourth'],req.user.interests['fifth']]},
	}
]}, {$or: [{
	$and: [{gender: {$eq: req.user.sexPref}}, {gender: {$eq: 'male'}}]},
	{$and: [{gender: {$eq: req.user.sexPref}}, {gender: {$eq: 'female'}}]}, 
	{gender2: {$eq: req.user.sexPref}}]}, { _id: {$ne: req.user.id}}
]}).sort({fame: -1})
	.select('firstname lastname username profileImages.image1')
	.exec()
	.then( docs => {
		console.log(docs);
		res.status(200).render('suggestedMatchas', {
			"users": docs.map(doc => {
				return {
					firstname: doc.firstname,
					lastname: doc.lastname,
					username: doc.username,
					profileImage: doc.profileImages.image1,
					request: {
						url: '/profiles/' + doc.id
					}
				}
			})
		});
	})
	.catch();
});
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
	res.render('dashboard', {
		name: req.user.username,
		pp: req.user.profileImages.image1,
		province: req.user.province,
		city: req.user.city,
		image1: req.user.profileImages.image2,
		image2: req.user.profileImages.image3,
		image3: req.user.profileImages.image4,
		image4: req.user.profileImages.image5,
		gender: req.user.gender,
		sexPref: req.user.sexPref,
		interests: req.user.interests,
		bio: req.user.bio

	}));
router.get('/notifications', (req, res) => res.render('notifications'));

// Index Controller
const IndexController = require("../controllers/index");

router.post('/dashboard', (req, res, next) => { res.locals.upload = upload; next(); }, IndexController.index_dashboard);
router.post('/profiles/:id', IndexController.index_profile);

module.exports = router;