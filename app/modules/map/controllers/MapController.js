/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map.controller', ['app.socket', 'app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives', 'app.dashboard.map.services'])

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
            console.log("MAP remove all ");
            removeAllMapObjects(args.layer);

        })


        $scope.$on('removeAllMapObjects', function(event, args){
            console.log("args layer");
            console.log(args.layer);
            removeMapObjects(args.layer, args.subType);
        })

        $scope.$on('switchLayer', function(event, args){
            switchLayer(args);
        });
        $scope.$on('updateMap', function(event, args){
            $scope.updateMap();
        });
        $scope.$on('changeCityOnMap', function(event, city){

            map.setCenter(city);


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
        var removeAllMapObjects = function(layer){
            var ollayer = map.olMap.getLayersByName(layer)[0];
            var featuresToRemove = [];
            for (i = 0;i<ollayer.features.length;i++){
                featuresToRemove.push(ollayer.features[i]);
            }
            ollayer.removeFeatures(featuresToRemove);
        };
        var switchLayer = function(){
            //toggle the OpenStreet and Google Layer
            //usually called from filter Panel
        };
        //******************

        //initial use case and filter
        var initialRequest = {
            "context": {
                "select":"Filter"
            }
        };

        socketService.send(initialRequest);

        //angular.element('#OpenLayers_Map_6_OpenLayers_ViewPort').css('width', "100%");
        //angular.element('#OpenLayers_Map_6_OpenLayers_ViewPort').css('height', "100%");
    }])

    .controller('filterController', ['$scope', 'mapService', 'socketService', function($scope, mapService, socketService){

        //Testvalues
        $scope.city = mapService.city;
        $scope.actualUsecaseOptions =mapService.actualUsecaseOptions;



        var deactivateAllActiveFilters = function(){

            for(var i = 0;i<mapService.actualUsecaseOptions[0].length;i++)
            {
                if(mapService.actualUsecaseOptions[0][i].requested == true)
                {
                    console.log("--- Deactivate Filter");
                    deactivateFilter(mapService.actualUsecaseOptions[0][i]);
                    mapService.actualUsecaseOptions[0][i].requested = false;
                }
            }

            //remove all objectes /just to be save
            $scope.$emit('removeAllMapObjects',
                {
                    layer: "mapObjectsLayer"

                }
            );

        }


        var deactivateFilter = function(filterOption){

            //FILTER DEACTIVATE
            if(filterOption.requestDeactivated  !== undefined)

            {
                socketService.send(filterOption.requestDeactivated);
                console.log("send requestDeactivated: " + filterOption.requestDeactivated);
            }


            mapService.deactivateCharts();

            $scope.$emit('removeMapObjects',
                {
                    layer: "mapObjectsLayer",
                    subType: filterOption.subType
                }
            );

        }



        $scope.$on('deactivateAllActiveFilters', function(event) {

            console.log("Deactivate All Active Filters");
            deactivateAllActiveFilters();

        });



        $scope.callFilter = function(filterOption, event){

            if (!filterOption.requested){

                //FILTER ACTIVATE

                filterOption.requested = !filterOption.requested;
                console.log("----------------------------------- Filter active");
               if(filterOption.requestChart !== undefined)
               {
                   console.log("send chart request Option level");
                   socketService.send(filterOption.requestChart);
               }
                socketService.send(filterOption.requestActivated);
                console.log("send requestActivated: " + filterOption.requestActivated);

            }else {


                filterOption.requested = !filterOption.requested;
                console.log("----------------------------------- Filter deactive");
                deactivateFilter(filterOption);

            }


            //because jsquery close the aside panel, we have to stop the event propagation!
            if (window.event) window.event.stopPropagation();
            else event.stopPropagation();
        };
    }])

    .controller('mapObjectInformationController', ['$scope', 'mapService', '$timeout', function($scope, mapService, $timeout){

        //$scope.headline = "Modal Split";
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
