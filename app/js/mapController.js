'use strict';

/* 
Date: 11.02.2015
by: Lars Willrich (lwi) 
*/
streetlife.controller('mapController', function($scope, $timeout, streetlifeSocket, streetlifeconfig) {
  angular.extend($scope, {

      }
  );

  $scope.guidance = function(){
    $('#guidanceMenu').css('display', 'inline');
    $('#guidanceMenu').css('top', $('#map').height()/2 - $('#guidanceMenu').height()/2);
    $('#guidanceMenu').css('left', $('#map').width()/2 - $('#guidanceMenu').width()/2);
  };
  $scope.guidanceClose = function(){
    $('#guidanceMenu').css('display', 'none');
  };

  var runInApply = function(fkt){
    $scope.$apply(fkt);
  };

  //managing changeMap-button
  $scope.changeMap = function(){
    $scope.leftMenu.changeMap($scope);
  };

  //managing checkboxes for parkingstations
  $scope.change = function(checkbox){
    $scope.leftMenu.change(streetlifeSocket, checkbox);
  };

  var init = function() {
    $scope.contentHight = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";

    $scope.config = streetlifeconfig;

    $scope.rightMenuScope = {};
    $scope.map = {};
    $scope.leftMenuScope = {};

    $scope.rightMenu = new RightMenu($scope.rightMenuScope, runInApply);
    $scope.streetlifeMap = new StreetlifeMap($scope.map, $scope.config, $scope.rightMenu);
    $scope.leftMenu = new LeftMenu($scope.leftMenuScope, $scope.map.olMap);

    $scope.streetlifeMap.addParkingLayer(streetlifeSocket);
  };

  init();

}).directive('leftMenu', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'html/LeftMenu.html'
  }
}).directive('guidanceMenu', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'html/GuidanceMenu.html'
  }
}).directive('rightMenu', function() {
      return {
        restrict: 'E',
        scope: false,
        templateUrl: 'html/RightMenu.html'
      }
});