var profile = angular.module('profile', [])
.controller('ProfileController', ['$scope', '$http', function($scope, $http){

	$scope.editProfileModal = function(){
		$('.edit-profile-modal')
          .modal({
            blurring: true
          })
          .modal('show')
        ;
	}

	$scope.saveProfile = function(){
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

        $('.edit-profile-modal').hide();
	};

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