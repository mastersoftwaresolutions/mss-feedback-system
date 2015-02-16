'use strict';

angular.module('feedbacks').controller('FeedbacksController', ['$scope','$rootScope', '$http', '$stateParams', '$location', 'Authentication', 'Feedbacks',
	function($scope,$rootScope, $http, $stateParams, $location, Authentication, Feedbacks) {
		$scope.authentication = Authentication;
		$scope.rating = '1';
		$scope.developer = 'Select Developer';
		$scope.queryBy = 'projectname';
		$scope.abc = false;
		if(!$scope.authentication.user) { 
			$location.path('/auth/signin');
		}
		if($scope.authentication.user.roles == 'developer') {
				$scope.authorized = 'false';
				
			}else {
				$scope.authorized = 'true';
			}

		$scope.create = function() {
			$scope.abc = true;
			var feedback = new Feedbacks({
				projectname: this.projectname,
				developer: this.developer,
				rating: this.rating,
				feedback: this.feedback

			});
			feedback.$save(function(response) {
				
				$rootScope.message = 'Feedback Given';
				$location.path('feedbacks');
				setTimeout(function(){
					$rootScope.message = '';
					$rootScope.$apply();
				}, 2000);
				//S$scope.$apply();
				$scope.projectname = '';
				$scope.developer = '';
				$scope.rating = '';
				$scope.feedback = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				
			});
		};
		$scope.setDeveloper = function(dev) {
			$scope.developer = dev;
		};

		$scope.remove = function(feedback) {
			var Confirm = confirm("Are you sure you want to delete?");
			if(Confirm == true) {
			//console.log(feedback);
			if (feedback) {
				feedback.$remove();
					$rootScope.message = 'Feedback is successfully deleted';
					setTimeout(function(){
					$rootScope.message = '';
					$rootScope.$apply();
				}, 2000);
				for (var i in $scope.feedbacks) {
					//console.log($scope.feedbacks);
					if ($scope.feedbacks[i] === feedback) {
						$scope.feedbacks.splice(i, 1);
					}
				}
			} else {
				$scope.feedback.$remove(function() {
					$location.path('feedbacks');
				});
			}
		}
		};

		$scope.update = function() {
			var arr = {};
			 arr.id = $scope.feedback.feedback._id,
			 arr.projectname = $scope.feedback.feedback.projectname,
			 arr.developer = $scope.feedback.developer[0]._id
			 arr.rating = $scope.feedback.feedback.rating,
			 arr.feedback = $scope.feedback.feedback.feedback,
			// arr.user = $scope.feedback.user,
			// arr.created = $scope.feedback.created,
			//console.log($scope.feedback.developer[0]._id);		
				
		$http.put('/feedbacks/' + $stateParams.feedbackId, arr).success(function(response) {
				//$scope.avg = response;
				console.log(response);
				$rootScope.message = 'Feedback is successfully updated';
				$location.path('feedbacks');
				setTimeout(function(){
					$rootScope.message = '';
					$rootScope.$apply();
				}, 2000);
			}) .error(function(response) {
				$scope.error = response.message;
			});
			
		};

		$scope.find = function() { //console.log('finding all');
			$scope.feedbacks = Feedbacks.query();

			$scope.curPage = 0;
 			$scope.pageSize = 10;
			$http.get('feedback/count')
            .success(function(response) {
            	$scope.feedbackCount = response[0].count;
            })
            .error(function(error) {
              $scope.error = error.message;
            }); 
 			$scope.numberOfPages = function(feedbacks) {
				return Math.ceil($scope.feedbackCount / $scope.pageSize);
			};
		};

		$scope.findOne = function() {
			$scope.feedback = Feedbacks.get({
				feedbackId: $stateParams.feedbackId
			});
		};

		$scope.userlist = function() {
			$http.get('/userlist').success(function(response) {
				// If successful we assign the response to the global user model				
				$scope.users = response;				
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		$scope.myfeedbacks = function() {
			$http.get('/myfeedbacks').success(function(response) {  //console.log('finding all 2');
				// If successful we assign the response to the global user model				
				$scope.feedbacks = response;
				$scope.curPage = 0;
 				$scope.pageSize = 10;
				$scope.feedbackCount = response.length;
				
			
				//console.log($scope.feedbackCount);			
			}).error(function(response) {
				$scope.error = response.message;
			});

			$scope.numberOfPages = function(feedbacks) {
				return Math.ceil($scope.feedbackCount / $scope.pageSize);
			};
		};
		

		//average rating
		$scope.calculateAverage = function() {
			//console.log($scope.feedbacks);

			$scope.ratings = 0;		
			$scope.ratingCount = 0;
			for (var i = 0; i < $scope.feedbacks.length; i++) {
				//console.log($scope.feedbacks[i].rating);
				$scope.ratings = parseInt($scope.ratings) + parseInt($scope.feedbacks[i].rating);
				$scope.ratingCount = $scope.ratingCount + 1;
				
			}
				var avg_rating= $scope.ratings/$scope.ratingCount;
				$scope.avgRatings = avg_rating.toFixed(1);//$scope.ratings/$scope.ratingCount;
				

		};

		


		// pagination
		
		 //$scope.curPage = 0;
		 //$scope.pageSize = 10;

		
		//$scope.numberOfPages = function() 
		 //{
		 //return Math.ceil($scope.feedbacklength / $scope.pageSize);
		 //};

		
		
	}
]);

angular.module('feedbacks').filter('pagination', function()
{
 return function(input, start)
 {
  if(input){
  start = +start;
  return input.slice(start);
 }
 };
});
'use strict';

angular.module('feedbacks').controller('FeedbacksController', ['$scope','$rootScope', '$http', '$stateParams', '$location', 'Authentication', 'Feedbacks',
	function($scope,$rootScope, $http, $stateParams, $location, Authentication, Feedbacks) {
		$scope.authentication = Authentication;
		$scope.rating = '1';
		$scope.developer = 'Select Developer';
		$scope.queryBy = 'projectname';
		if(!$scope.authentication.user) { 
			$location.path('/auth/signin');
		}
		if($scope.authentication.user.roles == 'developer') {
				$scope.authorized = 'false';
				
			}else {
				$scope.authorized = 'true';
			}
		$scope.create = function() {
			var feedback = new Feedbacks({
				projectname: this.projectname,
				developer: this.developer,
				rating: this.rating,
				feedback: this.feedback

			});
			feedback.$save(function(response) {
				$rootScope.message = 'Feedback Given';
				$location.path('feedbacks');
				setTimeout(function(){
					$rootScope.message = '';
					$rootScope.$apply();
				}, 2000);
				//S$scope.$apply();
				$scope.projectname = '';
				$scope.developer = '';
				$scope.rating = '';
				$scope.feedback = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.setDeveloper = function(dev) {
			$scope.developer = dev;
		};

		$scope.remove = function(feedback) {
			var Confirm = confirm("Are you sure you want to delete?");
			if(Confirm == true) {
			//console.log(feedback);
			if (feedback) {
				feedback.$remove();
					$rootScope.message = 'Feedback is successfully deleted';
					setTimeout(function(){
					$rootScope.message = '';
					$rootScope.$apply();
				}, 2000);
				for (var i in $scope.feedbacks) {
					//console.log($scope.feedbacks);
					if ($scope.feedbacks[i] === feedback) {
						$scope.feedbacks.splice(i, 1);
					}
				}
			} else {
				$scope.feedback.$remove(function() {
					$location.path('feedbacks');
				});
			}
		}
		};

		$scope.update = function() {
			var arr = {};
			 arr.id = $scope.feedback.feedback._id,
			 arr.projectname = $scope.feedback.feedback.projectname,
			 arr.developer = $scope.feedback.developer[0]._id
			 arr.rating = $scope.feedback.feedback.rating,
			 arr.feedback = $scope.feedback.feedback.feedback,
			// arr.user = $scope.feedback.user,
			// arr.created = $scope.feedback.created,
			//console.log($scope.feedback.developer[0]._id);		
				
		$http.put('/feedbacks/' + $stateParams.feedbackId, arr).success(function(response) {
				//$scope.avg = response;
				console.log(response);
				$rootScope.message = 'Feedback is successfully updated';
				$location.path('feedbacks');
				setTimeout(function(){
					$rootScope.message = '';
					$rootScope.$apply();
				}, 2000);
			}) .error(function(response) {
				$scope.error = response.message;
			});
			
		};

		$scope.find = function() { //console.log('finding all');
			$scope.feedbacks = Feedbacks.query();

			$scope.curPage = 0;
 			$scope.pageSize = 10;
			$http.get('feedback/count')
            .success(function(response) {
            	$scope.feedbackCount = response[0].count;
            })
            .error(function(error) {
              $scope.error = error.message;
            }); 
 			$scope.numberOfPages = function(feedbacks) {
				return Math.ceil($scope.feedbackCount / $scope.pageSize);
			};
		};

		$scope.findOne = function() {
			$scope.feedback = Feedbacks.get({
				feedbackId: $stateParams.feedbackId
			});
		};

		$scope.userlist = function() {
			$http.get('/userlist').success(function(response) {
				// If successful we assign the response to the global user model				
				$scope.users = response;				
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		$scope.myfeedbacks = function() {
			$http.get('/myfeedbacks').success(function(response) {  //console.log('finding all 2');
				// If successful we assign the response to the global user model				
				$scope.feedbacks = response;
				$scope.curPage = 0;
 				$scope.pageSize = 10;
				$scope.feedbackCount = response.length;
				
			
				//console.log($scope.feedbackCount);			
			}).error(function(response) {
				$scope.error = response.message;
			});

			$scope.numberOfPages = function(feedbacks) {
				return Math.ceil($scope.feedbackCount / $scope.pageSize);
			};
		};
		

		//average rating
		$scope.calculateAverage = function() {
			//console.log($scope.feedbacks);

			$scope.ratings = 0;		
			$scope.ratingCount = 0;
			for (var i = 0; i < $scope.feedbacks.length; i++) {
				//console.log($scope.feedbacks[i].rating);
				$scope.ratings = parseInt($scope.ratings) + parseInt($scope.feedbacks[i].rating);
				$scope.ratingCount = $scope.ratingCount + 1;
				
			}
				var avg_rating= $scope.ratings/$scope.ratingCount;
				$scope.avgRatings = avg_rating.toFixed(1);//$scope.ratings/$scope.ratingCount;
				

		};

		


		// pagination
		
		 //$scope.curPage = 0;
		 //$scope.pageSize = 10;

		
		//$scope.numberOfPages = function() 
		 //{
		 //return Math.ceil($scope.feedbacklength / $scope.pageSize);
		 //};

		
		
	}
]);

angular.module('feedbacks').filter('pagination', function()
{
 return function(input, start)
 {
  if(input){
  start = +start;
  return input.slice(start);
 }
 };
});
