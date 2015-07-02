var profile = angular.module('profile', [])
.controller('ProfileController', ['$scope', '$http', function($scope, $http){
	
	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(data){
		$scope.user = {
			firstName: data._json.first_name,
			lastName: data._json.last_name
		}
		$scope.fbid = data.id;
	});

	$scope.onSave = function(user){
		var fbid = $scope.fbid;
		$http({
			method: 'PUT',
			url: '/api/saveInfo/' + fbid,
			data: userSaveData
		}).success(function(data){
			console.log(data);
		})
	};
}]);