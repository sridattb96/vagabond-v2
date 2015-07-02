var profile = angular.module('profile-real', [])
.controller('ProfileRealController', ['$scope', '$http', function($scope, $http){

	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(data){
		console.log("FIRSTNAME = " + data._json.first_name);
		$scope.user = {
			firstName: data._json.first_name,
			lastName: data._json.last_name,
			id: data.id

		}
	});



	
}]);