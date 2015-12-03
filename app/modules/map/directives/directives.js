/**
 * Created by lwi on 31.03.2015.
 */

angular.module('app.dashboard.map.directives', ['app.socket', 'app.config'])

    .directive('olMap', function(){
        return {
            restrict: 'E',
            template: ' <div id="map"></div> ',
            controller: 'mapController'
        };
    }).directive('filter', function(){
        return{
            restrict: 'E',
            template: '<ul class="off-canvas-list" style="margin-top: 15px">' +
            '<filterentry ng-repeat="cityEntry in actualUsecaseOptions"></filterentry>' +
            '</ul>',
            controller: 'filterController'
        };
    }).directive('filterentry', function(){
        return{
            restrict: 'E',
            template:
            '<li class="filterEntry" ng-repeat="option in cityEntry">' +
            '<a ng-if="option.enabled" ng-class="{filterActive: option.requested}" id="{{option.id}}" ng-click="callFilter(option, $event)">{{option.value}}</a>' +
            '</li>'
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