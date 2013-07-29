'use strict';

/* Controllers */
angular.module('controllers', []).
  controller('ZoneCtrl', ['$scope', '$http'], function($scope, $http){
    $scope.test = 'hello';
    $http({method: 'GET', url: '/api/zones'}).
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.zones = data;
      }).
      error(function(data, status, headers, config) {
        $scope.zones = [];
      })
  })