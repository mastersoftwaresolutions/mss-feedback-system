'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	request = require("request"),
	User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	//delete req.body.roles;

	// Init Variables
	// var user = new User(req.body);
	// var message = null;

	// // Add missing user fields
	// user.provider = 'local';
	// user.displayName = user.firstName + ' ' + user.lastName;

	// // Then save the user 
	// user.save(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		// Remove sensitive data before login
	// 		user.password = undefined;
	// 		user.salt = undefined;

	// 		req.login(user, function(err) {
	// 			if (err) {
	// 				res.status(400).send(err);
	// 			} else {
	// 				res.json(user);
	// 			}
	// 		});
	// 	}
	// });
};

			
/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, userRedmine, info) {
		if (err || !userRedmine) {
			res.status(400).send(info);
		} else {
			User.findOne({
					email: userRedmine.mail

				},
				function(err, userFind) { //console.log('find ',err, userFind, userRedmine.mail);
					//if(email == user.mail) {
					if (err) {
						return done(err);
					}
					if (!userFind) {
						//return done(null, false, {
						if (!userRedmine.login) {
							var userName = req.body.username;
						} else {
							var userName = userRedmine.login;
						}
						var userArray = {};
						userArray.firstName = userRedmine.firstname,
							userArray.lastName = userRedmine.lastname,
							userArray.email = userRedmine.mail,
							userArray.roles = userRedmine.role,
							userArray.username = userName,
							userArray.password = 'Admin123#'
						var user = new User(userArray);
						// var message = null;

						// Add missing user fields
						user.provider = 'local';
						user.displayName = userArray.firstName + ' ' + userArray.lastName;

						// Then save the user 
						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								// Remove sensitive data before login
								user.password = undefined;
								user.salt = undefined;

								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										res.json(user);
									}
								});
							}
						});
						//message: 'Unknown user or invalid password'
						//});
					} else if (userFind) {

						User.update({
							_id: userFind._id
						}, {
							roles: [userRedmine.role]
						}).exec(function(err, updateUser) {
							console.log(updateUser);
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								// Remove sensitive data before login
								//update.password = undefined;
								//update.salt = undefined;
								userFind.roles[0] = userRedmine.role;
								req.login(userFind, function(err) {
									if (err) {
										res.status(400).send(err);

									} else { //console.log(res);
										res.json(userFind);
									}
								});
							}
						});

						
					}
				
				});

		}
	})(req, res, next);
};

/**
 * saving all users to database
 */
 exports.allusers = function(req, res) {
 	
	request.post('http://mastersoftwaretechnologies.com/feedbacksystem/php-redmine-api-master/allusers.php', {},
		function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body)
				//console.log('-----------', info.users[0].managers);
				var all_users = info.users[0].developers;
				var developers = info.users[0].developers;
				for (var i = 0; i < developers.length; i++) {
				  checkUser(developers[i].email, i,  function(status, index){
				  	//console.log(':::::', managers[index].email);
				  	if(status){
				  		var user = new User(developers[index]); 
				  		user.roles = {};
				  		user.roles[0] = 'developer'
				  		user.save(function(err,docs) {
				  			console.log('sss',docs);
				  			//console.log('sts',status,index);
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								// Remove sensitive data before login
								user.password = undefined;
								user.salt = undefined;

							  }
						});
				  	}else{
				  		console.log('saved already');
				  	}
				  })
				}





				// for (var i = 0; i < all_users.length; i++) {
				//   checkUser(all_users[i].email, i,  function(status, index){
				//   	//console.log(status, index, all_users[index].email)
				//   	var mail = all_users[index].email;
				//   	//var email = managers.email;
				//   	//console.log(mail);
				//   	//console.log(email);

				//   	// if(status){
				//   	// 	var count = 0;
				//   	// 	//console.log("insert", managers)
				//   	// 	for (var i = 0; i < managers.length; i++) {
				//   	// 		console.log('m_email',managers[i].email , mail);
				//   	// 		// if(managers[i].email == mail) {
				//   	// 		// 	count = 1;
				//   	// 		// 	console.log('alllllllllllll', managers[i].email, mail)
				//   	// 		// }else{
				//   	// 		// 	++count;
				//   	// 		// }
				//   	// 		// if(i == managers.length - 1) {
				//   	// 		// 	// console.log('--------------',managers[i].email , count)
				//   	// 		// }
				//   	// 	};

				//   	// }
				//   	// else if(!status){
				//   	// 	console.log('already')
				//   	// }

				//   })
				// };
				// // console.log('-----', all_users.length);
				// var length = all_users.length;
				// //console.log('....', length);
				// for(var i=0; i<length; i++)
				// {	//console.log(managers[i]);
				// 	var email = all_users[i].email;
				// 	User.findOne({
				// 	email: email
				// 	}).exec(function(err, save){
				// 		//console.log(save);
				// 		if (err) {
				// 		return res.status(400).send({
				// 			message: errorHandler.getErrorMessage(err)
				// 		});
				// 	} else {
				// 		if(!save){
				// 			var user = new User(all_users[i]);
				// 		user.save(function(err) {
				// 	if (err) {
				// 		console.log(err);
				// 		//return res.status(400).send({
				// 			//message: errorHandler.getErrorMessage(err)
				// 		//});
				// 	} else {
				// 		// Remove sensitive data before login
				// 		user.password = undefined;
				// 		user.salt = undefined;
				// 		//console.log('new user add', managers[i].email);
				// 		// req.login(user, function(err) {
				// 		// 	if (err) {
				// 		// 		res.status(400).send(err);
				// 		// 	} else {
				// 		// 		res.json(user);
				// 		// 	}
				// 		// });
				// 	}
				// });
				// 		}
						

				// 	}
				// 	}); 

				// }
				// if (info.success == true) {
				// 	return done(null, info.user[0]);
				// } else {
				// 	return done(null, false, {
				// 		message: 'Unknown user or invalid password'
				// 	});
				// }
			} else {
				console.log('error ', error);
			}
		}
	);
		
		function checkUser(usrEmail, index, cb){
			User.findOne({
					email: usrEmail
					}).exec(function(err, row){
					  if(err){
					  	cb(false, index)	
					  }
					  if(row){
					  	cb(false, index)
					  }
					  else{
					  	cb(true, index)
					  }
					});
		}
		
	
 };

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};