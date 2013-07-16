$(function(){
  $.cookie.json = true;
  var http = 'http://', port = ':8000', host = http+'localhost'+port;

  function navigate(target){
    Backbone.history.navigate(target, {trigger:true})
  }
  
  var AudioCollection = Backbone.Collection.extend({
    url: function(){
      return host+'/api/audio';
    }
  });


  //This is the Backbone controller that manages the content of the app
  var App = Backbone.View.extend({
  	el:$('#content'),
  	initialize:function(options){
  		//Initialize all views so we can call them to render when necessary
  		Backbone.history.on('route', function(source, path, route){
    		//Simply sets the content as appropriate
    		this.$el.html(new this.pages[path]().render(route));
      }, this);
  	},
  	//This object defines the content for each of the routes in the application
  	pages:{
      "":Backbone.View.extend({
        template:$("#home-tmpl").html(),
        render:function(route){
          return _.template(this.template, {});
        }
      }),
      
      "media":Backbone.View.extend({
        template:$('#media-tmpl').html(),
        render:function(route){
          var audioZones = new AudioCollection();
          audioZones.fetch();
          console.log(audioZones.toJSON());
          return _.template(this.template, { zones:'' });
        }
      })
  	},
  });


  //This is the Backbone controller that manages the Nav Bar
  var NavBar = Backbone.View.extend({
  	id:$('#main-menu-left'),
  	el:$('#main-menu'),
  	initialize:function(options){
  		Backbone.history.on('route',function(source, path){ this.render(path) }, this);
  	},
  	//This is a collection of possible routes and their accompanying
  	//user-friendly titles
  	titles: {
  		"media":"Media",
  		"security":"Security",
  	},
  	events:{
  		'click a.link':function(source) {
  			navigate(source.target.getAttribute('href'));
  			//Cancel the regular event handling so that we won't actual change URLs
  			//We are letting Backbone handle routing
  			return false;
  		},
  	},
  	//Each time the routes change, we refresh the navigation
  	//items.
  	render:function(route){
  		$(this.id).empty();
  		for (key in this.titles)	$(this.id).append(_.template('<li class="<%= active %>"><a href="./#/<%= url %>"><%= title %></a></li>', {url:key, title:this.titles[key], active:route === key ? 'active' : ''}));
  		if($('#main-menu-right').html() == '')	{
  			$('#main-menu-right').html(_.template($('#inner-navbar-tmpl').html(), { user:$.cookie('user') }));
  		}
  	},
  });


  //Every time a Router is instantiated, the route is added
  //to a global Backbone.history object. Thus, this is just a
  //nice way of defining possible application states
  var AppRouter = new (Backbone.Router.extend({
  	routes: {
  		"":"",
      "/media":"media",
  	},
  }));

  //Attach Backbone Views to existing HTML elements
  new NavBar();
  var app = new App();

  //Start the app by setting kicking off the history behaviour.
  //We will get a routing event with the initial URL fragment
  Backbone.history.start();
});