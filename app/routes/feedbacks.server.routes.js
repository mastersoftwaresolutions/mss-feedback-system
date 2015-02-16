'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	feedbacks = require('../../app/controllers/feedbacks.server.controller');

module.exports = function(app) {
	// Feedback Routes
	app.route('/feedbacks')
		.get(feedbacks.list)
		.post(users.requiresLogin, feedbacks.create);

	app.route('/feedbacks/:feedbackId')
		.get(feedbacks.read)
		.put(users.requiresLogin, feedbacks.hasAuthorization, feedbacks.update)
		.delete(users.requiresLogin, feedbacks.hasAuthorization, feedbacks.delete);

	//user list routes
	app.route('/userlist')
		.get(users.requiresLogin, feedbacks.userlist);

	//tl feedback routes
	app.route('/myfeedbacks')
		.get(users.requiresLogin, feedbacks.myfeedbacks);

//get total count for pagination
	app.route('/feedback/count').get(users.requiresLogin, feedbacks.count);
	

	// Finish by binding the feedback middleware
	app.param('feedbackId', feedbacks.feedbackByID);
};