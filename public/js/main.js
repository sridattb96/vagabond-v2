var main = angular.module('main', []);

function mainController($scope, $http) {

    $scope.orderProp = '-time';

    function initialize() {
        var input = (document.getElementById('placeName'));
        var autocomplete = new google.maps.places.Autocomplete(input);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.placeData = {};

    //$scope.modalData = {};

    $scope.placeId = {};

    $scope.sendRequest = function() {
        var placeId = $scope.placeId;
        $http({
            method: 'POST',
            url: '/api/sendRequest/' + placeId,
            data: {}
        }).success(function(data){
            console.log('new place object: ')
            console.log(data);
        });
    }

    $scope.moment = function(time) {
        return moment(time).fromNow(); 
    }

    $scope.seePlace = function(place) {

        $scope.placeId = place._id;

        $('.card-modal')
          .modal({
            blurring: true
          })
          .modal('show')
        ;

        //get user's info and display
        $http.get('/api/user/' + place.requester.facebookId)
            .success(function(data){
                $scope.modalData = data;
            });

        //get mutual likes
        // var m = moment(place.time).fromNow();
        // console.log(m);
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

    $scope.addPlaceModal = function() {
        $('.add-place-modal')
          .modal({
            blurring: true
          })
          .modal('show')
        ;
    }

    $scope.addPlace = function(){
        $scope.place.name = document.getElementById('placeName').value;
        var placeData = $scope.place;
        $http({
            method: 'POST',
            url: '/api/places',
            data: placeData
        }).success(function(data){
            $scope.places = data; 
            $scope.place.name = null;
            $scope.place.reason = null;
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

