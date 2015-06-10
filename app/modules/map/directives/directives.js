/**
 * Created by lwi on 31.03.2015.
 */

angular.module('app.dashboard.map.directives', ['app.socket', 'app.config'])

    .directive('resize', ['$window', function ($window) {
    return function (scope, element) {
        var w = angular.element(window);
        scope.getWindowDimensions = function () {
            return { 'h': $(window).height(), 'w': $(window).width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.addStyleToMap = function () {
                return {
                    'height': (newValue.h - 150) + 'px',
                };
            };
            scope.addStyleToInfoPanel = function () {
                return {
                    'height': (newValue.h - 150) + 'px'
                };
            };

            var mapContainerWidth = angular.element("#mapContainer").width();
            var mapContainerHeight = angular.element("#mapContainer").height();
            angular.element('#OpenLayers_Map_6_OpenLayers_ViewPort').css('width', mapContainerWidth + "px");
            angular.element('#OpenLayers_Map_6_OpenLayers_ViewPort').css('height', mapContainerHeight + "px");

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
        scope.$emit('updateMap', null);
    };
}])
    .directive('olMap', function(){
    return {
        restrict: 'E',
        template: ' <div id="map" ng-style="addStyleToMap()"  style="height: 800px; width: 800px" resize></div> ',
        controller: 'mapController'
    };
    }).directive('filter', function(){
    return{
        restrict: 'E',
        template: '<ul class="off-canvas-list">' +
        '<filterentry ng-repeat="filter in filters"></filterentry>' +
        '</ul>',
        controller: 'filterController'
    };
    }).directive('filterentry', function(){
        return{
            restrict: 'E',
            template: '<li><label>{{filter.title}}</label></li>' +
            '<li class="filterEntry" ng-repeat="option in filter.options">' +
            '<a ng-class="{filterActive: option.requested}" id="{{option.id}}" ng-click="callFilter(option, $event)">{{option.value}}</a>' +
            '</li>',
            controller: 'filterController'
        };
    }).directive('mapObjectInformation', function(){
        return{
            restrict: 'E',
            templateUrl: function(elem, attr){
                return 'modules/map/partials/MapObjectInformation'+attr.align+'.html';
            },
            controller: 'mapObjectInformationController'
        };
    });