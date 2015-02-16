'use strict';

//Feedbacks service used for communicating with the feedbacks REST endpoints
angular.module('feedbacks').factory('Feedbacks', ['$resource',
	function($resource) {
		return $resource('feedbacks/:feedbackId', {
			feedbackId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);