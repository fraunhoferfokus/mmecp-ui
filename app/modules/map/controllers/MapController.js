/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map', ['app.socket', 'app.config', 'app.dashboard.map.directives'])

    .service('mapService', function(socketService){
        this.requestnewMapObjects = function(requestString){
            socketService.send(requestString);
        };

        /*this.openMapObjectInformationPanelFuntion;
        var openMapObjectInformationPanelFuntion= this.openMapObjectInformationPanelFuntion;
        this.closeMapObjectInformationPanelFuntion;
        var closeMapObjectInformationPanelFuntion= this.closeMapObjectInformationPanelFuntion;
        this.setOpenMapObjectInformationPanelFunction = function(fnk){
            openMapObjectInformationPanelFuntion = fnk;
        };
        this.setCloseMapObjectInformationPanelFunction = function(fnk){
            closeMapObjectInformationPanelFuntion = fnk;
        };
        this.openMapObjectInformationPanel = function(){
            openMapObjectInformationPanelFuntion();
        };

        this.closeMapObjectInformationPanel = function(){
            closeMapObjectInformationPanelFuntion();
        };*/
    })

    .controller('mapController', ['$scope', 'mapService', 'configService', 'socketService', function($scope, mapService, configService, socketService){
        this.map = new OLMap(configService, mapService);
        var map = this.map;

        var newObserver = {
            notify : function(){
                var mo = socketService.getLastRecievedMapObject();
                map.addObjects(mo);
            }
        };
        socketService.addObserver(newObserver);

        //Events:
        //******************
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
            map.olMap.updateSize();
        };
        var removeMapObjects = function(layer, subType){
            var ollayer = map.olMap.getLayersByName(layer)[0];
            var featuresToRemove = [];
            for (i = 0;i<ollayer.features.length;i++){
                if (ollayer.features[i].mapObject.objectSubtype == subType){
                    featuresToRemove.push(ollayer.features[i]);
                }
            }
            ollayer.removeFeatures(featuresToRemove);
        };
        var switchLayer = function(){
            //toggle the OpenStreet and Google Layer
            //usually called from filter Panel
        };
        //******************

    }])

    .controller('filterController', ['$scope', 'mapService', function($scope, mapService){

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
                mapService.requestnewMapObjects(filterOption.requestString);
                console.log("request: " + filterOption.requestString);
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

    .controller('mapObjectInformationController', ['$scope', 'mapService', function($scope, mapService){
        //Events:
        //openInformationPanel, closeInformationPanel
        //******************
        $scope.headline = "Modal Split";

        /*$scope.$on('openInformationPanel', function(event, args){
            openInformationPanel(args);
        });

        $scope.$on('closeInformationPanel', function(event, args){
            closeInformationPanel();
        });*/

        var openInformationPanel = function(){
            //Show the information Panel with information out of the mapObject
            //usually called by clicking on polygon
        };
        var closeInformationPanel = function(){
            //hide the information Panel
            //usually called from map Panel
        };
        //******************
    }]);