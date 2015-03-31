/**
 * Created by lwi on 31.03.2015.
 */

angular.module('app.dashboard.map.directives', ['app.socket', 'app.config'])

    .directive('olMap', function(){
    return {
        restrict: 'E',
        template: ' <div style="width:100%; height:100%" id="map"></div> ',
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