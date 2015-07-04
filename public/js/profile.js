var profile = angular.module('profile', [])
.controller('ProfileController', ['$scope', '$http', function($scope, $http){

	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(user){
		// console.log("FIRSTNAME = " + user.fb._json.first_name);
		$scope.user = user;
		$scope.user.firstName = user.fb._json.first_name;
		$scope.user.lastName = user.fb._json.last_name;
		$scope.user.occupation = user.fb._json.occupation;
		$scope.user.id = user.fb.id
	});



	
}]);