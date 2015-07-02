var profileedit = angular.module('profileedit', [])
.controller('ProfileEditController', ['$scope', '$http', function($scope, $http){

	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(fbdata){
		$scope.fbid = fbdata.id;
		$http({
			method: 'GET',
			url: '/api/getSavedInfo/' + fbdata.id,
		    data: {},
		}).success(function(userdata){
			$scope.user = userdata;
			$scope.user.firstName = fbdata._json.first_name,
			$scope.user.lastName = fbdata._json.last_name
		});
	});

	$scope.onSave = function(){
		var userSaveData = $scope.user;
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