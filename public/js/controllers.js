'use strict';

/* Controllers */

angular.module('peak.controllers', []).

  controller('IndexCtrl', function ($scope, User) {
    $scope.name = 'Hugh';
    $scope.users = User.query();
  }).
  
  controller('AuthCtrl', function ($scope, User) {
    $scope.login = function(){
      var user = User.get({ username:$scope.username, });
    };
  }).
  
  controller('NewUserCtrl', function ($scope, $location, User) {
    $scope.newUser = {};
    $scope.saveUser = function(){
      new User($scope.newUser).$save();
      $location.path('/').replace();
    };
  }).
  
  controller('NavbarCtrl', function ($scope, $location){
    $scope.route = function(page){
      var currentRoute = $location.path().substring(1);
      return page === currentRoute ? 'active' : '';
    }
  }).
  
  controller('HvacCtrl', function ($scope, $location){
    
  });
  
