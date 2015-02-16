'use strict';

// Configuring the Feedbacks module
angular.module('feedbacks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Feedbacks', 'feedbacks', 'dropdown', '/feedbacks(/create)?');
		Menus.addSubMenuItem('topbar', 'feedbacks', 'List Feedbacks', 'feedbacks');
		/*Menus.addSubMenuItem('topbar', 'feedbacks', 'New Feedback', 'feedbacks/create');*/
	}
]);