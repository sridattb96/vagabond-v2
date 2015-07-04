var main = angular.module('main', []);

function mainController($scope, $http) {
    $scope.placeData = {};

//this sets up a google places listener, so once you fix the input box thing this works I tested in diff file

    // function initialize() {
    //     var input = $scope.formData.text;
    //     var autocomplete = new google.maps.places.Autocomplete(input);
    // }

    // google.maps.event.addDomListener(window, 'load', initialize);

//---------------------

    $scope.seePlace = function(place) {
        console.log(place.requester.facebookId);
        var url = 'https://graph.facebook.com/' + place.requester.facebookId + '?fields=context.fields%28mutual_likes%29&access_token=' + $scope.loginInfo.accessToken; 
        $http.get(url)
            .success(function(data) {
                console.log('Mutual likes = ' + data.context.mutual_likes.summary.total_count);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }


    $http.get('/api/places')
        .success(function(data) {
            $scope.places = data;
            console.log("PLACES DATA IS HERE vvv")
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.addPlace = function(){
        var placeData = $scope.place;
        $http({
            method: 'POST',
            url: '/api/places',
            data: placeData
        }).success(function(data){
            $scope.places = data; 
            placeData = {};
            console.log(data);
        })
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

    $http.get('/api/loginInfo') 
        .success(function(data) {
            $scope.loginInfo = data; 
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // $scope.$on('$includeContentLoaded', function () {
        // $('.masthead')
        //   .visibility({
        //     once: false,
        //     onBottomPassed: function() {
        //       $('.fixed.menu').transition('fade in');
        //     },
        //     onBottomPassedReverse: function() {
        //       $('.fixed.menu').transition('fade out');
        //     }
        //   })
        // ;
        // // create sidebar and attach to menu open
        // $('.ui.sidebar')
        //   .sidebar('attach events', '.toc.item')
        // ;

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
        $('.main.menu').visibility({
          type: 'fixed'
        });
    // });



}

