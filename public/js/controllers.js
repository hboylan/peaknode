'use strict';

/* Controllers */

angular.module('peak.controllers', []).
  controller('IndexController', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/users'
    }).
    success(function (data, status, headers, config) {
      $scope.users = data;
    }).
    error(function (data, status, headers, config) {
      $scope.err = 'Error!'
    });

  });
