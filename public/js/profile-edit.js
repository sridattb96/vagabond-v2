var profileEdit = angular.module('profile-edit', [])
.controller('ProfileEditController', ['$scope', '$http', function($scope, $http){

	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(data){
		$scope.user = {
			firstName: data._json.first_name,
			lastName: data._json.last_name,
			fbid: data.id
		}
	
	});

	$scope.onSave = function(user){
		var userSaveData = $scope.user;
		var fbid = $scope.user.fbid;
		$http({
			method: 'PUT',
			url: '/api/saveInfo/' + fbid,
			data: userSaveData
		}).success(function(data){
			console.log(data);
		})
	};
}]);