'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	config = require('./config');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserialize sessions
	passport.deserializeUser(function(user, done) {
		//console.log("iddddddd",user)
		 done(null, user);
		
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};