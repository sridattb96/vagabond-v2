var profileEdit = angular.module('profile-edit', [])
.controller('ProfileEditController', ['$scope', '$http', function($scope, $http){

	$('#saveMsg').hide();

	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(user){
		console.log(user)
		// $scope.fbid = user.fb.id;
		$scope.user = user;
		$scope.user.firstName = user.fb._json.first_name;
		$scope.user.lastName = user.fb._json.last_name;
		$scope.user.occupation = user.occupation;
		$scope.user.email = user.fb.email;

	});

	$scope.onSave = function(){
		$('#saveMsg').show();
		var userSaveData = $scope.user;
		var fbid = $scope.user.fb.id;
		$http({
			method: 'PUT',
			url: '/api/saveInfo/' + fbid,
			data: userSaveData
		}).success(function(data){
			console.log(data);
		}).error(function(data) {
            console.log('Error: ' + data);
        });
	};
}]);