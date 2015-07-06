var profile = angular.module('profile', [])
.controller('ProfileController', ['$scope', '$http', function($scope, $http){

	// $scope.user = {}; 
	$scope.moment = function(time) {
        return moment(time).fromNow(); 
    }

	$('.ui.menu .ui.dropdown').dropdown({
	  on: 'hover'
	});
	$('.ui.menu a.item')
	  .on('click', function() {
	    $(this)
	      .addClass('active')
	      .siblings()
	      .removeClass('active')
	    ;
	  })
	;

	// $scope.find = function(person) {
	// 	$http({
	// 		method: 'GET',
	// 		url: 'api/user/' + person,
	// 		data: {},
	// 	}).success(function(user) {
	// 		return user; 
	// 	})
	// }

	$http({
		method: 'GET',
		url: 'api/loginInfo',
		data: {},
	}).success(function(user){
		// console.log("FIRSTNAME = " + user.fb._json.first_name);

		$scope.user = user;
		$http({
			method: 'GET',
			url: 'api/requests/' + $scope.user.fb.id,
			data: {}
		}).success(function(requests) {
			$scope.requests = requests;
		})
	});
	
	// $scope.getInterested = function() {
	// 	console.log('show interested people');
	// }
	
}]);