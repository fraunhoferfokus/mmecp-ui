/**
 * Created by lwi on 31.03.2015.
 */

angular.module('app.dashboard.map.directives', ['app.socket', 'app.config'])

    .directive('resize', ['$window', function ($window) {
    return function (scope, element) {
        var w = angular.element(window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.addStyleToMap = function () {
                console.log("height: " + (newValue.h - 150) + 'px' + " width: " + (newValue.w) + 'px');
                return {
                    'height': (newValue.h - 150) + 'px',
                    'width': (newValue.w) + 'px'
                };
            };
            scope.addStyleToInfoPanel = function () {
                return {
                    'height': (newValue.h - 150) + 'px'
                };
            };
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    };
}])
    .directive('olMap', function(){
    return {
        restrict: 'E',
        template: ' <div id="map" ng-style="addStyleToMap()"  style="height: 100%" resize></div> ',
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
            '<li ng-repeat="option in filter.options">' +
            '<a ng-class="{filterActive: option.requested}" id="{{option.id}}" ng-click="callFilter(option)">{{option.value}}</a>' +
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