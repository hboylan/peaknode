'use strict';

/* Services */
angular.module('peak.services', ['ngResource']).

  factory('User', function($resource){
    var User = $resource('api/users', {}, {
      query:{ method:'GET', isArray:true },
      save:{ method:'POST' },
    });
    return User;
  });