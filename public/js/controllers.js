angular.module('peakApp.controllers', []).
  controller('ZoneCtrl', function($scope, $location, Zone){
    $scope.zones = Zone.query();
    $scope.home = function(){ $location.path('') };
  }).
  controller('MediaCtrl', function($scope, $http, AudioZone){
    $scope.audioZones = AudioZone.query();
  })