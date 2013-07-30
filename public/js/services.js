angular.module('peakApp.services', ['ngResource']).
  factory('Zone', function($resource){
    return $resource('/api/zones/:id', {}, {
      query:{ method:'GET', params:{ id:'' }, isArray:true }
    });
  }).
  factory('AudioZone', function($resource){
    return $resource('/api/audio/:id', {}, {
      query:{ method:'GET', params:{ id:'' }, isArray:true }
    });
  })
