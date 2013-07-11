$(function(){
  //Empty current zones div
  $('#zones').html('');
  
  //Retrieve connected audio zones
  $.get('http://localhost:8000/api/audio', function(data){
    data.zones.forEach(function(z){
      //Parse template for zone and append in view
      $('#zones').append(_.template($('#zone-volume-tmpl').html(), z));
      
      //Activate zone's volume slider
      $('#slider-'+z.zone_id).slider({ value:z.volume, min:0, max:100, step:1, orientation:'vertical',
        change:function(evt, ui){
          var volume = ui.value;
          if(isNaN(volume)) return;
                        
          //Update view with value
          $('#value'+z.zone_id).html(volume);
                        
          //Perform action with API
          $.ajax({
            url:'http://localhost:8000/api/audio/'+z.zone_id,
            type:'post',
            dataType:'json',
            data:{ volume:volume }
          });
        },
        
        slide:function(evt, ui){
          $('#volume-'+z.zone_id).html(ui.value);
        }
      });
    });
    //end get
  });
});