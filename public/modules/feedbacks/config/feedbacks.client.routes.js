'use strict';

// Setting up route
angular.module('feedbacks').config(['$stateProvider',
	function($stateProvider) {
		// Feedbacks state routing
		$stateProvider.
		state('listFeedbacks', {
			url: '/feedbacks',
			templateUrl: 'modules/feedbacks/views/list-feedbacks.client.view.html'
		}).
		state('createFeedback', {
			url: '/feedbacks/create',
			templateUrl: 'modules/feedbacks/views/create-feedback.client.view.html'
		}).
		state('viewFeedback', {
			url: '/feedbacks/:feedbackId',
			templateUrl: 'modules/feedbacks/views/view-feedback.client.view.html'
		}).
		state('editFeedback', {
			url: '/feedbacks/:feedbackId/edit',
			templateUrl: 'modules/feedbacks/views/edit-feedback.client.view.html'
		}).
		state('tldash', {
			url: '/dashboard',
			templateUrl: 'modules/feedbacks/views/tl-dash.client.view.html'
		}).
		state('devdash', {
			url: '/dev',
			templateUrl: 'modules/feedbacks/views/dev-dash.client.view.html'
		}).
		state('myfeedbacks', {
			url: '/myfeedbacks',
			templateUrl: 'modules/feedbacks/views/my-feedbacks.client.view.html'
		});
	}
]);