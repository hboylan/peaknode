'use strict';


// Declare app level module which depends on filters, and services
angular.module('peakApp', ['peakApp.controllers', 'peakApp.filters', 'peakApp.services', 'peakApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'index', controller:ZoneCtrl })
    $routeProvider.when('/energy', {templateUrl: 'energy' })
    $routeProvider.otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
  }]);