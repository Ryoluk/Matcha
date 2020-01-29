const multer = require('multer');

const User = require('../models/User');
const Likes = require('../models/Likes');

exports.index_dashboard = (req, res) => {
	let uploads = res.locals.upload.fields([{
		name: 'image1', maxCount: 1
	}, {
		name: 'image2', maxCount: 1
	}, {
		name: 'image3', maxCount: 1
	}, {
		name: 'image4', maxCount: 1
	}
	]);
	uploads(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			req.flash('error_msg', err);
			res.status(500).redirect('/dashboard');
		}
		else if (err) {
			req.flash('error_msg', err);
			res.status(500).redirect('/dashboard');
		}
		if (req.files['image1']) {
			var val = {
				$set: {
					"profileImages.image2": req.files['image1'][0].filename
				}
			}
		}
		else if (req.files['image2']) {
			var val = {
				$set: {
					"profileImages.image3": req.files['image2'][0].filename
				}
			}
		}
		else if (req.files['image3']) {
			var val = {
				$set: {
					"profileImages.image4": req.files['image3'][0].filename
				}
			}
		}
		else if (req.files['image4']) {
			var val = {
				$set: {
					"profileImages.image5": req.files['image4'][0].filename
				}
			}
		}
		await User.findByIdAndUpdate(req.user.id, val, { new: true }, (err, doc) => {
			if (err) {
				req.flash('error_msg', err);
				res.status(500).redirect('/dashboard');
			}
			req.flash('success_msg', 'Successfully updated picture.');
			
			res.redirect('/dashboard');
		});
	});
};

exports.index_profile = (req, res) => {
	const id = req.params.id;

	Likes.findOne({$and: [{_userId: req.user.id}, {likedId: id}]}, (err, doc) => {
		if (err) {
				req.flash('error_msg', err.message);
				console.log("err" + err);
				console.log("user" + doc);
				res.status(500).redirect('/profiles/' + id);
			}
	})
	.exec()
	.then((user) => {
		if (user) {
			User.findOneAndUpdate({_id: id}, {$inc: {likes: -1}}, (err, doc) => {
				if (err) {
					req.flash('error_msg', err);
					console.log("err" + err);
					console.log("user" + doc);
					res.status(500).redirect('/profiles/' + id);
				}
			}).then((doc) => {
				Likes.deleteOne({$and: [{_userId: req.user.id}, {likedId: id}]}, (err, doc) => {
					if (err) {
						req.flash('error_msg', err);
						console.log("err" + err);
						console.log("user" + doc);
						res.status(500).redirect('/profiles/' + id);
					}
				})
				.exec()
				.then((doc) => {
					if (doc) res.redirect('/profiles/' + id);
				});
			});
			// console.log("found");
			// res.redirect('/profiles/' + id);
		} else {
			User.findOneAndUpdate({_id: id}, {$inc: {likes: 1}}, (err) => {
				if (err) {
					req.flash('error_msg', err);
					console.log("err" + err);
					res.status(500).redirect('/profiles/' + id);
				}
			})
			.exec()
			.then((doc) => {
				const newLike = new Likes({
					_userId: req.user.id,
					likedId: id
				});
				newLike.save().then((doc) => {
					if (doc) res.redirect('/profiles/' + id);
				});
			});
			// console.log("Not found");
			// res.redirect('/profiles/' + id);
		}
	});
}