var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next){
	res.render('addpost', {
		'title': 'Add Post'
	});
});

router.post('/add', function(req, res, next){
	// Get form values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	if(req.files.mainimage) {
		// comes from the form
		var mainImageOriginalName = req.files.mainimage.originalname;
		var mainImageName = req.files.mainimage.name;
		var mainImageMime = req.files.mainimage.mimetype;
		var mainImagePath = req.files.mainimage.path;
		var mainImageExt = req.files.mainimage.extension;
		var mainImageSize = req.files.mainimage.size;
	} else {
		var mainImageName = 'noimage.png';
	}

	// Form Validation
	req.checkBody('title', "Title field is required").notEmpty();
	req.checkBody('boby', 'Content is required for post').notEmpty();

	// Check errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost', {
			"errors": errors,
			"title" : title,
			"body" : body
		});
	} else {
		var posts = db.get('posts');
		//submit to the db
		posts.insert({
			"title" : title,
			"body" : body,
			"category" : category,
			"date": date,
			"author" : author,
			"mainimage": mainimage
		}, function(err, post){
			if (err){
				res.send({'There was an issue submitting post'});
			} else {
				req.flash('success', 'Post Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router