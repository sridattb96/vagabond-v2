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

	});

	$scope.onSave = function(){
		$('#saveMsg').show();
		var userSaveData = $scope.user;

		// userSaveData.interests = $scope.user.interests.splice(',');
		userSaveData.interests = $scope.user.interests.split(',');

		// console.log('user interested in ' + userSaveData.interests); 
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