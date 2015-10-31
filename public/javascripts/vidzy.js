var app = angular.module('Vidzy', ['ngResource', 'ngRoute']);

var config = ['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})
		.when('/add-video', {
			templateUrl: 'partials/video-form.html',
			controller: 'AddVideoCtrl'
		})
		.when('/video/edit/:id', {
			templateUrl: 'partials/video-form.html',
			controller: 'EditVideoCtrl'
		})
		.when('/video/:id', {
			templateUrl: 'partials/video-details.html',
			controller: 'EditVideoCtrl'
		})
		.when('/video/:id/delete', {
			templateUrl: 'partials/video-details.html',
			controller: 'DeleteVideoCtrl'
		})
		.otherwise({
			redirectTo: '/'
		})
}];

app.config(config);

// Home controller
app.controller('HomeCtrl', ['$scope', '$resource', function($scope, $resource){
	var api = $resource('api/videos');
	api.query(function(videos){
		$scope.videos = videos;
	});
}]);

// Add video controller
app.controller('AddVideoCtrl', ['$scope', '$resource',  '$location', function($scope, $resource, $location){
	$scope.save = function(){
		var api = $resource('api/videos');
		api.save($scope.video, function(){
			$location.path('/');
		});
	};
}]);

// Edit video controller
app.controller('EditVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams){
		var api = $resource('api/videos/:id', {id: '@_id'},{
			update: { method: 'PUT' }
		});

		api.get({ id: $routeParams.id }, function(video){
			$scope.video = video;
		});

		$scope.save = function(){
			api.update($scope.video, function(video){
				$location.path('/');
			});
		};
	}]);

app.controller('DeleteVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams){
		var api = $resource('api/videos/:id');
		api.get({ id: $routeParams.id }, function(video){
			$scope.video = video;
		});

		var delButton = angular.element( document.querySelector( '#delete_button' ) );
		delButton.removeClass('hide');
		$scope.delete = function(){
			api.delete({ id: $routeParams.id }, function(response){
				if(response.status == 200){
					$location.path('/');
				}else{
					alert('Error during delete.');
				}
			});
		};
	}]);