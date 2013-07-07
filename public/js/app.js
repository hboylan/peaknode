'use strict';

// Declare app level module which depends on filters, and services

angular.module('peak', ['peak.controllers', 'peak.services']).
  config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index',
        controller: 'IndexCtrl'
      }).
      when('/register', {
        templateUrl: 'register',
        controller: 'NewUserCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });