'use strict';

// Declare app level module which depends on filters, and services

angular.module('peak', [
  'peak.controllers'
]).
config(function ($routes, $location) {
  $routes.
    otherwise({
      redirectTo: '/index'
    });

  $location.html5Mode(true);
});