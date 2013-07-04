'use strict';

// Declare app level module which depends on filters, and services

angular.module('peak', [
  'peak.controllers'
]).
config(function ($routes, $location) {
  $routes.
    when('/index', {
      templateUrl: 'index',
      controller: 'IndexController'
    }).
    otherwise({
      redirectTo: '/index'
    });

  $location.html5Mode(true);
});