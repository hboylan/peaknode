angular.module('peakApp', [
  'peakApp.controllers',
  'peakApp.filters',
  'peakApp.services',
  'peakApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/',       { templateUrl: 'partials/home', controller: 'ZoneCtrl' }).
    when('/media',  { templateUrl: 'partials/media', controller: 'MediaCtrl' }).
    otherwise({ redirectTo: '/' })

  $locationProvider.html5Mode(true);
})