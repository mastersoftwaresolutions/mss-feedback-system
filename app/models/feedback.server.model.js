'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Feedback Schema
 */
var FeedbackSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	/*title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},*/
	projectname: {
		type: String,
		default: '',
		trim: true,
		required: 'Project Name cannot be blank'
	},
	developer: {
		type: Schema.ObjectId,
		ref: 'User',
		
		required: 'Developer cannot be blank'
	},
	rating: {
		type: String,
		default: '',
		required: 'Rating cannot be blank'
	},
	feedback: {
		type: String,
		default: '',
		trim: true,
		required: 'Feedback cannot be blank'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Feedback', FeedbackSchema);