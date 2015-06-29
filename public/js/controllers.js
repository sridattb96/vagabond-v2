var vagabond = angular.module('vagabond', []);

function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/api/places')
        .success(function(data) {
            $scope.places = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.createPlace = function() {
        $http.post('/api/places', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; 
                $scope.places = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deletePlace = function(id) {
        $http.delete('/api/places/' + id)
            .success(function(data) {
                $scope.places = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}

