/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map', ['app.socket', 'app.config'])

    .service('mapService', function(socketService){
        this.mapObjects = [];
        console.log("run mapservice");
        var newObserver = {
            notify : function(){
                var mo = socketService.getLastRecievedMapObject();
                //addObjects(mo);
                console.dir(mo);
            }
        };
        socketService.addObserver(newObserver);

    })

    .controller('mapController', ['$scope', 'mapService', 'configService', 'socketService', function($scope, mapService, configService, socketService){
        var map = new OLMap(configService, mapService);

        //Events:
        //addLayer, removeLayer, switchLayer
        //******************
        $scope.$on('addLayer', function(event, args){
            addLayer(args);
        });
        $scope.$on('removeLayer', function(event, args){
            addLayer(args);
        });
        $scope.$on('switchLayer', function(event, args){
            switchLayer(args);
        });
        $scope.$on('updateMap', function(event, args){
            updateMap();
        });

        var updateMap = function(){
            map.olMap.updateSize();
        };
        var addLayer = function(newLayer){
            //add new Layer
            //usually called from filter Panel
        };
        var removeLayer = function(layer){
            //add new Layer
            //usually called from filter Panel
        };
        var switchLayer = function(){
            //toggle the OpenStreet and Google Layer
            //usually called from filter Panel
        };
        //******************

    }])

    .controller('filterController', ['$scope', 'mapService', 'socketService', function($scope, mapService, socketService){
        //new LeftMenu();


        //Testvalues
        $scope.filters = [
            {
                title: "park and ride",
                options:{
                    1: "macrozone",
                    2: "microzone"
                }
            },
            {
                title: "Berlin Event",
                options:{
                    1: "events",
                    2: "streetwork"
                }
            }
        ];

        $scope.callFilter = function(title, option){
            console.log("call filter: " + title + " -> " + option);
            socketService.send("getObjectsOfType:ParkingAreas");

            //because jsquery close the aside panel, we have to stop the event propagation!
            window.event.stopPropagation();
        };
    }])

    .controller('informationController', ['$scope', 'mapService', function($scope, mapService){
        //Events:
        //openInformationPanel, closeInformationPanel
        //******************
        $scope.$on('openInformationPanel', function(event, args){
            openInformationPanel(args);
        });

        $scope.$on('closeInformationPanel', function(event, args){
            closeInformationPanel();
        });

        var openInformationPanel = function(){
            //Show the information Panel with information out of the mapObject
            //usually called by clicking on polygon
        };
        var closeInformationPanel = function(){
            //hide the information Panel
            //usually called from map Panel
        };
        //******************


        //new RightMenu();


    }])

    .directive('olMap', function(){
        return {
            restrict: 'E',
            template: ' <div style="width:100%; height:100%" id="map"></div> ',
            controller: 'mapController'
        }
    }).directive('filter', function(){
        return{
            restrict: 'E',
            template: '<ul class="off-canvas-list">' +
            '<filterentry ng-repeat="filter in filters"></filterentry>' +
            '</ul>',
            controller: 'filterController'
        }
    }).directive('filterentry', function(){
        return{
            restrict: 'E',
            template: '<li><label>{{filter.title}}</label></li>' +
            '<li ng-repeat="option in filter.options">' +
            '<a ng-click="callFilter(filter.title, option)">{{option}}</a>' +
            '</li>',
            controller: 'filterController'
        }
    });