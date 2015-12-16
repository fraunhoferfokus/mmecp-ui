/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map.controller', ['app.socket', 'app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives', 'app.dashboard.map.services'])

    .controller('mapController', ['$scope', 'mapService', 'configService', 'socketService', '$rootScope', function($scope, mapService, configService, socketService, $rootScope){
        this.map = new OpenLayer3Map(configService, function(broadcastmessage){
            $rootScope.$broadcast(broadcastmessage, null);
        }, mapService);
        var map = this.map;

        var newObserver = {
            notify : function(){
                var mo = socketService.getLastRecievedMapObject();
                map.addObjects(mo);
                //deactivate loading

                $rootScope.$broadcast('deactivateLoadingIcon');



            }
        };
        socketService.addObserver(newObserver);

        //Events:
        //******************
        $scope.$on('removeAllMapObjects', function(event, args){
            console.log("MAP remove all ");
            removeAllMapObjects(args.layer);

        });

        $scope.$on('removeMapObjects', function(event, args){
            console.log("args layer");
            console.log(args.layer);
            removeMapObjects(args.layer, args.subType);



        });

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
         //3   map.olMap.updateSize();
            console.log("updated map");
        };
        var removeMapObjects = function(layer, subType){

            if(layer == "ber_traffic_heatmap_full")
            {
                map.removeHeatMapFeatures();
            }
            else
            {

                map.removeFeaturesWithSubType(subType);
            }


        };
        var removeAllMapObjects = function(layer){

            map.removeAllFeatures();
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

    }])

    .controller('filterController', ['$scope','$rootScope', 'mapService', 'socketService',function($scope,$rootScope, mapService,socketService){

        $scope.city = mapService.city;
        $scope.actualUsecaseOptions =mapService.actualUsecaseOptions;

        var deactivateAllActiveFilters = function(){

            for(var i = 0;i<mapService.actualUsecaseOptions[0].length;i++)
            {
                if(mapService.actualUsecaseOptions[0][i].requested === true)
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

        };

        var deactivateFilter = function(filterOption){

            //FILTER DEACTIVATE
            if(filterOption.requestDeactivated  !== undefined)

            {
                socketService.send(filterOption.requestDeactivated);
                console.log("send requestDeactivated: " + filterOption.requestDeactivated);
            }

            mapService.unRegisterActiveOption(filterOption.subType);

            mapService.removeMapLegend(filterOption.id);

            mapService.deactivateCharts();


            if(mapService.showOnlySelectedFeatureMode.optionID == filterOption.subType)
            {
                mapService.showOnlySelectedFeatureMode.active = false;
            }

            $scope.$emit('removeMapObjects',
                {
                    layer: filterOption.id,
                    subType: filterOption.subType
                }
            );


            //remove description from view panel
            $rootScope.$broadcast("removeOptionDescriptionFromViewPanel", filterOption.optionID);
            $rootScope.$broadcast("closeInformationTabIfEmpty", filterOption.optionID);




        };



        $scope.$on('deactivateAllActiveFilters', function(event) {

            console.log("Deactivate All Active Filters");
            deactivateAllActiveFilters();

        });


        $scope.callFilter = function(filterOption, event){

            if (!filterOption.requested){

                //FILTER ACTIVATE
                filterOption.requested = !filterOption.requested;


                mapService.registerActiveOption(filterOption.subType);

                console.log("----------------------------------- Filter active");

                var requestFilter = function()
                {
                    socketService.send(filterOption.requestActivated);
                    console.log("send requestActivated: " + filterOption.requestActivated);

                };
               if(filterOption.requestChart !== undefined)
               {
                   console.log("send chart request Option level");
                   socketService.send(filterOption.requestChart);
                   $rootScope.$broadcast("optionActivated", filterOption);
                   $rootScope.$broadcast('activateLoadingIcon');
                   setTimeout(requestFilter,500);
               }
                else
               {
                   $rootScope.$broadcast("optionActivated", filterOption);
                   $rootScope.$broadcast('activateLoadingIcon');
                   requestFilter();
               }




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

        var updateMapObject = function(){
            var mapObject = mapService.mapObjectForInformationPanel;
            $scope.elements = [];
            if (mapObject === undefined) return;
            for (i = 0; i < mapObject.elements.length; i++) {

                if (mapObject.elements[i].attribute) {
                    $scope.elements.push(mapObject.elements[i].attribute);
                }
            }
        };

        updateMapObject();
    }]);
