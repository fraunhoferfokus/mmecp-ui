/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map', ['app.socket', 'app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives'])

    .service('mapService', function(socketService){
        this.requestnewMapObjects = function(requestString){
            socketService.send(requestString);
        };
        this.mapObjectForInformationPanel = undefined;
    })

    .controller('mapController', ['$scope', 'mapService', 'configService', 'socketService', '$rootScope', function($scope, mapService, configService, socketService, $rootScope){
        this.map = new OLMap(configService, function(broadcastmessage){
            $rootScope.$broadcast(broadcastmessage, null);
        }, mapService);
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
            $scope.updateMap();
        });

        $scope.updateMap = function(){
            map.olMap.updateSize();
            console.log("updated map");
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

        $scope.callFilter = function(filterOption, event){

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
            if (window.event) window.event.stopPropagation();
            else event.stopPropagation();
        };
    }])

    .controller('mapObjectInformationController', ['$scope', 'mapService', '$timeout', function($scope, mapService, $timeout){

        $scope.headline = "Modal Split";
        $scope.elements = [];

        $scope.$on('updateMapObject', function(event, mapObject){
            if(!$scope.$$phase) {
                $scope.$apply(function(){
                    updateMapObject();
                });
            }else{
                updateMapObject();
            }
        });

        $scope.xAxisTickFormatFunction = function(){
            return function(d){
                return "sun";
            };
        };

        $scope.exampleData = [
            {
                "key": "Series 1",
                "values": [
                ]
            }
        ];

        var updateMapObject = function(){
            var mapObject = mapService.mapObjectForInformationPanel;
            $scope.elements = [];
            if (mapObject === undefined) return;
            for (i = 0; i < mapObject.elements.length; i++) {

                if (mapObject.elements[i].attribute) {
                    $scope.elements.push(mapObject.elements[i].attribute);
                }else if (mapObject.elements[i].chart){
                    var chartObject = mapObject.elements[i].chart;

                    var values = [];
                    for (x = 0; x<chartObject.data.length;x++){
                        values[x] = [
                            chartObject.data[x].label,
                            chartObject.data[x].value
                        ];
                    }

                    $scope.exampleData = [
                        {
                            "key": chartObject.valuedescription,
                            "values": values
                        }
                    ];
                }
            }
        };

        updateMapObject();
    }]);