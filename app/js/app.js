'use strict';

/* 
Date: 11.02.2015
by: Lars Willrich (lwi) 
*/

var streetlife = angular.module('streetlife', ["ngSanitize", "openlayers-directive", "ngWebSocket", "googlechart"]);
streetlife.controller('bodyController', function($scope, $timeout) {

  $scope.showImpressum = function(){
    $('#tabs a[href="#Impressum"]').show();
    $('#tabs a[href="#Impressum"]').tab('show');
    var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
    $('.contentHight').css('height', height);
  };

}).directive('header', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'html/Header.html'
  }
}).directive('content', function() {
  return {
    restrict: 'E',
    templateUrl: 'html/Content.html'
  }
}).directive('impressum', function() {
  return {
    restrict: 'E',
    templateUrl: 'html/Impressum.html'
  }
}).factory('streetlifeconfig', function() {
  var config;
  $.ajaxSetup({
    async: false
  });
  $.getJSON( "config/map.json", function(data) {
    config = data;
  }).fail(function(data) {
    console.log( "error: " + data.status);
  });
  $.ajaxSetup({
    async: true
  });

  return config;

}).factory('streetlifeSchema', function() {
  return {
    getSchema: function(name){
      var returnvalue;
      $.ajaxSetup({
        async: false
      });
      $.getJSON( "json/" + name, function(data) {
        returnvalue = data;
      }).fail(function(data) {
        console.log( "error: " + data.status);
      });
      $.ajaxSetup({
        async: true
      });

      return returnvalue;
    }
  };

}).factory('streetlifeSocket', function($websocket, streetlifeconfig, streetlifeSchema) {
  // Open a WebSocket connection
  var ws = $websocket(streetlifeconfig.socket.url);

  var mapObjects = [];
  var subject = [];

  ws.onMessage(function(event) {
    var res;
    try {

      res = JSON.parse(event.data);
      var validator = new ZSchema();
      var schema = "schema.json";

      var schemaMapObject = streetlifeSchema.getSchema(schema);
      var valid = validator.validate(res, schemaMapObject);
      if (!valid) {
        console.log("requested json File is not valid with schema " + schema);
        console.log(validator.getLastErrors());
        return null;
      }
    } catch(e) {
      res = {'username': 'anonymous', 'message': event.data};
    }
    mapObjects.push(res);
    for (var i = 0;i<subject.length;i++){
      subject[i].notify();
    }
  });
  ws.onError(function(event) {
    console.log('connection Error', event);
  });
  ws.onClose(function(event) {
    console.log('connection closed', event);
  });
  ws.onOpen(function() {
    console.log('connection open');
  });

  var lastCommandSends = [];
  return {
    getLastRecievedMapObject : function(){
      return mapObjects[mapObjects.length - 1];
    },
    addObserver: function(newObserver){
      console.log("add new Observer");
      subject.push(newObserver);
    },
    lastCommandSends: lastCommandSends,
    getLastCommmandSend: function(){
      return lastCommandSends[lastCommandSends.length-1];
    },
    mapObjects: mapObjects,
    status: function() {
      return ws.readyState;
    },
    send: function(message) {
      if (angular.isString(message)) {
        this.lastCommandSends.push(message);
        ws.send(message);
      }
      else if (angular.isObject(message)) {
        ws.send(JSON.stringify(message));
      }
    }
  };
});

var closeImpressum = function(){
  $('#tabs a[href="#mapPanel"]').tab('show');
  $('#tabs a[href="#Impressum"]').hide();
  var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
  $('.contentHight').css('height', height);
};

var showNotification = function(text){
  $('.top-right').notify({
    message: {text: text},
    type: "info",
    fadeOut: {
      delay: 5000
    }
  }).show();
};

var makeNotificationReady = function(){

  window.prettyPrint && prettyPrint()
  $('.show-notification').click(function (e) {
    $('.top-right').notify({
      message: {text: "Notification-Example"},
      type: "info",
      fadeOut: {
        delay: 5000
      }
    }).show();
  });

  /* Custom Styles */
  var custom = [
    'bangTidy',
    'blackgloss'
  ];

  for (var i = 0; i < custom.length; i++) {
    var type = custom[i];

    (function (type) {
      $('.show-' + type).click(function (e) {
        var message = "Notification-Example";
        $('.' + message[0]).notify({message: {text: message[2]}, type: type}).show();
      });
    })(type);
  }
};

$(window).resize(function(){
  var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
  $('.contentHight').css('height', height);
});



$( document ).ready(function() {
  $('#tabs').tab();

  var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
  $('.contentHight').css('height', height);
  $('#tabs a[href="#Impressum"]').hide();

  makeNotificationReady();
});