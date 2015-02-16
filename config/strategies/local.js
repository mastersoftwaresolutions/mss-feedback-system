'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User'),
	request = require("request");

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			request.post('http://mastersoftwaretechnologies.com/feedbacksystem/php-redmine-api-master/api.php', {
					form: {
						username: username,
						password: password
					}
				},
				function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var info = JSON.parse(body)
						if (info.success == true) {
							return done(null, info.user[0]);
						} else {
							return done(null, false, {
								message: 'Unknown user or invalid password'
							});
						}
					} else {
						console.log('error ', error);
					}
				}
			);
		}
	));
};
