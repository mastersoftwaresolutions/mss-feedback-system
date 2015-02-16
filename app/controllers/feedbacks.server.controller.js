'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feedback = mongoose.model('Feedback'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a feedback
 */
exports.create = function(req, res) {
	var feedback = new Feedback(req.body);
	feedback.user = req.user._id;
	//console.log(req.user);
	feedback.save(function(err) {console.log(err);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(feedback);
		}
	});
};

/**
 * Show the current feedback
 */
exports.read = function(req, res) { 
	//res.json(req.feedback);
	var feedback = req.feedback;
	//console.log(req.feedback.developer);
	User.find({
			_id: req.feedback.developer
	}).exec(function(err, developer) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else {
			res.json({feedback:feedback,developer:developer});
		}
	});
};

/**
 * Update a feedback
 */
exports.update = function(req, res) {
	
Feedback.update(
   { _id:req.param('feedbackId') },
   {
   	projectname : req.body.projectname,
   	rating : req.body.rating,
   	feedback : req.body.feedback
   }
).exec(function(err,update){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(update);
		}
});
	
};

/**
 * Delete an feedback
 */
exports.delete = function(req, res) {
	var feedback = req.feedback;

	feedback.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(feedback);
		}
	});
};

/**
 * List of Feedbacks
 */
exports.list = function(req, res) {
	
	if(req.user.roles[0] == 'developer') {
		var query = {developer:req.user._id}
	}else if(req.user.roles[0] == 'tl'){
		var query = {user:req.user._id}
	}else {
		var query = '';
	}
	function getDeveloper(ids, cb) {
		User.find({
			_id: ids
		}).exec(function(err, user) {
			cb(user);
		});
	}

	Feedback.find(query).sort('-created').populate('user', 'displayName').exec(function(err, feedbacks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {


		if (feedbacks) {
			var responseArray = [];
			for (var i = 0; i < feedbacks.length; i++) {
				responseArray.push({
					'_id': feedbacks[i]._id,
					'projectname':feedbacks[i].projectname,
					'rating':feedbacks[i].rating,
					'feedback':feedbacks[i].feedback,
					'user':feedbacks[i].user,
					'created':feedbacks[i].created,
					'developer':feedbacks[i].developer
					
				});
			}
			i = 0;
			var recursiveCall = function(developer) { //console.log('dev is ',developer);
				if (i > 0) responseArray[i - 1].developer = developer;
				if (i === responseArray.length) {
					return res.json(responseArray);
				}
				getDeveloper(responseArray[i].developer, recursiveCall);
				i++;
			};
			recursiveCall();
		}
			//res.json(feedback);
		}
	});
};
/**
 * List of Users
 */
exports.userlist = function(req, res) {
	if(req.user.roles[0] == 'tl') {
		var query = {roles:'developer'}
	}else if(req.user.roles[0] == 'pm'){
		var query = '';
	}else {
		var query = '';
	}
	 User.find(query).exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {//console.log(users);
			res.json(users);
		}
	});
};


/**
 * Get count for pagination
 */
exports.count = function(req, res) {
if(req.user.roles[0] == 'developer') {
		var query = {developer:req.user._id}
	}else if(req.user.roles[0] == 'tl'){
		var query = {user:req.user._id}
	}else {
		var query = '';
	}
	Feedback.find(query).exec(function(err, feedbacks) {//console.log(feedbacks);
		//console.log(req.user);
		if (err) {
			res.status(400).send(err);
		}
		if (feedbacks) {

			var count = feedbacks.length;
			res.json([{
				count: count
			}]);
		}
	});

};



/**
* tl own feedbacks
*/
exports.myfeedbacks = function(req, res) {

	
		var query = {developer:req.user._id}
		//console.log("...", req.user.id);
	function getDeveloper(ids, cb) {
		User.find({
			_id: ids
		}).exec(function(err, user) {
			cb(user);
		});
	}

	Feedback.find(query).sort('-created').populate('user', 'displayName').exec(function(err, feedbacks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {


		if (feedbacks) {
			var responseArray = [];
			for (var i = 0; i < feedbacks.length; i++) {
				responseArray.push({
					'_id': feedbacks[i]._id,
					'projectname':feedbacks[i].projectname,
					'rating':feedbacks[i].rating,
					'feedback':feedbacks[i].feedback,
					'user':feedbacks[i].user,
					'created':feedbacks[i].created,
					'developer':feedbacks[i].developer
					
				});
			}
			i = 0;
			var recursiveCall = function(developer) { //console.log('dev is ',developer);
				if (i > 0) responseArray[i - 1].developer = developer;
				if (i === responseArray.length) {
					return res.json(responseArray);
				}
				getDeveloper(responseArray[i].developer, recursiveCall);
				i++;
			};
			recursiveCall();
		}
			//res.json(feedback);
		}
	});
};



	
/**
 * Feedback middleware
 */
exports.feedbackByID = function(req, res, next, id) {
	Feedback.findById(id).populate('user', 'displayName').exec(function(err, feedback) {
		if (err) return next(err);
		if (!feedback) return next(new Error('Failed to load feedback ' + id));
		req.feedback = feedback;
		next();
	});
};

/**
 * Feedback authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*if (req.feedback.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}*/
	next();
};