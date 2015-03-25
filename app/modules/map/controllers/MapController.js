/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map', ['app.socket', 'app.config'])

    .service('mapService', function(socketService, configService){
        this.map = new OLMap(configService);
        var map = this.map;

        var newObserver = {
            notify : function(){
                var mo = socketService.getLastRecievedMapObject();
                map.addObjects(mo);
            }
        };
        socketService.addObserver(newObserver);

    })

    .controller('mapController', ['$scope', 'mapService', 'socketService', function($scope, mapService, socketService){

        //Events:
        //addLayer, removeLayer, switchLayer
        //******************
        $scope.$on('addLayer', function(event, args){
            addLayer(args);
        });
        $scope.$on('removeMapObjects', function(event, args){
            removeMapObjects(args.layer, args.subType);
        });
        $scope.$on('switchLayer', function(event, args){
            switchLayer(args);
        });
        $scope.$on('updateMap', function(event, args){
            updateMap();
        });

        var updateMap = function(){
            mapService.map.updateSize();
        };
        var addLayer = function(newLayer){
            //add new Layer
            //usually called from filter Panel
        };
        var removeMapObjects = function(layer, subType){
            var layer = mapService.map.olMap.getLayersByName(layer)[0];
            var featuresToRemove = [];
            for (i = 0;i<layer.features.length;i++){
                if (layer.features[i].mapObject.objectSubtype == subType){
                    featuresToRemove.push(layer.features[i]);
                }
            }
            layer.removeFeatures(featuresToRemove);
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
                    0: {
                        value: "ParkingAreas",
                        id: "parkandride:ParkingAreas",
                        requestString: "getObjectsOfType:ParkingAreas",
                        subType: "macro",
                        requested: false
                    },
                    1: {
                        value: "ParkingStationsFree",
                        id: "parkandride:ParkingStationsFree",
                        requestString: "getObjectsOfType:ParkingStationsFree",
                        subType: "forfree",
                        requested: false
                    },
                    2: {
                        value: "ParkingStationsFee",
                        id: "parkandride:ParkingStationsFee",
                        requestString: "getObjectsOfType:ParkingStationsFee",
                        subType: "fee",
                        requested: false
                    },
                    3: {
                        value: "ParkingStationsClock",
                        id: "parkandride:ParkingStationsClock",
                        requestString: "getObjectsOfType:ParkingStationsClock",
                        subType: "cardblock",
                        requested: false
                    }
                }
            },
            {
                title: "Berlin Event",
                options:{
                    0: {
                        value: "events",
                        id: "BerlinEvent:events",
                        requestString: "xxx:xxx",
                        subType: "-",
                        requested: false
                    },
                    1: {
                        value: "streetwork",
                        id: "BerlinEvent:streetwork",
                        subType: "-",
                        requestString: "xxx:xxx",
                        requested: false
                    },
                    2: {
                        value: "...",
                        id: "BerlinEvent:...",
                        requestString: "xxx:xxx",
                        subType: "-",
                        requested: false
                    }
                }
            }
        ];

        $scope.callFilter = function(filterOption){

            if (!filterOption.requested){
                socketService.send(filterOption.requestString);
            }else {
                $scope.$emit('removeMapObjects',
                    {
                        layer: "parkingLayer",
                        subType: filterOption.subType
                    }
                );
            }

            filterOption.requested = !filterOption.requested;

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
            '<a ng-class="{filterActive: option.requested}" id="{{option.id}}" ng-click="callFilter(option)">{{option.value}}</a>' +
            '</li>',
            controller: 'filterController'
        }
    });