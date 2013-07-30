angular.module('peakApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version)
    };
  }]).
  directive('volumeSlider', function(){
    return {
      replace:true,
      transclude:true,
      restrict:'E',
      link:function($scope, $element, $attrs){
        $element.slider({ value:$attrs.volume, min:0, max:100, step:1, orientation:'vertical',
          change:function(evt, ui){
            var vol = ui.value;
            if(isNaN(vol)) return;
                  
            //Perform action with API
            $http.post('/api/audio/'+z.zone, { volume:vol }).
              success(function(data, status, headers, config){
                $scope.zones = data;
              }).
              error(function(data, status, headers, config){
                $scope.zones = [];
              })
          },
  
          slide:function(evt, ui){
            $scope.volume = ui.value;
            $scope.$apply();
          }
        })
      },
      template:
        '<div class="span3">'+
          '<h5>{{ zone.name }}</h5>'+
          '<div id="slider-{{ zone.zone }}"></div>'+
          '<br>'+
          '<b id="volume-{{ zone.zone }}">{{ zone.volume }}</b>'+
        '</div>',
    }
  })