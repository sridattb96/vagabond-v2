var profile = angular.module('profile', [])
.controller('ProfileController', ['$scope', '$http', function($scope, $http){

	$scope.master = {};

	$scope.onSave = function(user){
		$scope.master = angular.copy(user);
		$http({
			method: 'GET',
			url: 'api/loginInfo',
			data: {},
		}).success(function(profileData){
			console.log(profileData.id);
			$http({
				method: 'PUT',
				url: '/api/saveInfo/' + profileData.id,
				data: { user: user }
			}).success(function(data){
				console.log('youve saved');
				console.log(data);
			})
		})
	};
}]);