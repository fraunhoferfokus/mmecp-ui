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


            //remove datepicker in case it is open
            $rootScope.$broadcast("closeDatePicker");




        };



        $scope.$on('deactivateAllActiveFilters', function(event) {

            console.log("Deactivate All Active Filters");
            deactivateAllActiveFilters();

        });





        var requestFilter = function(filterOption,event)
        {
            console.log("ajlkdsf");
            console.log(filterOption);
            if(filterOption.dialogs !== undefined)
            {
                if(filterOption.dialogs.datesQuery === true)
                {
                    // date range selection active: date has to be selected before request
                    console.log("openDatePicker Event send");
                    $rootScope.$broadcast("openDatePicker",filterOption);


                }
            }
            else
            {

                $rootScope.$broadcast("optionActivated", filterOption);
                $rootScope.$broadcast('activateLoadingIcon');

                socketService.send(filterOption.requestActivated);
                console.log("send requestActivated: " + filterOption.requestActivated);

            }


        };


        $scope.callFilter = function(filterOption, event){

            if (!filterOption.requested){

                //FILTER ACTIVATE
                filterOption.requested = !filterOption.requested;


                mapService.registerActiveOption(filterOption.subType);

                console.log("----------------------------------- Filter active");



                console.log(filterOption.optionID);
                if(filterOption.optionID == "ber_ms_sim") //special filter with own task saved in frontend
                {
                    $rootScope.$broadcast("openModalSplitSilmulator");
                }
                else
                {
                    if(filterOption.requestChart !== undefined) //standard filter call backend for mapobjects for active filters
                    {
                        //filter +
                        console.log("send chart request Option level");
                        socketService.send(filterOption.requestChart);

                        setTimeout(requestFilter(filterOption,event),500);
                    }
                    else
                    {
                        requestFilter(filterOption,event);
                    }


                }

            }else {

                filterOption.requested = !filterOption.requested;
                console.log("----------------------------------- Filter deactive");
                deactivateFilter(filterOption);
                if(filterOption.optionID == "ber_ms_sim") //special filter with own task saved in frontend
                {
                    $rootScope.$broadcast("closeModalSplitSilmulator");
                }

            }


            //because jsquery close the aside panel, we have to stop the event propagation!
            if (window.event) window.event.stopPropagation();
            else event.stopPropagation();
        };
    }])

    .controller('mapObjectInformationController', ['$scope', 'mapService', '$timeout', function($scope, mapService, $timeout){

        $scope.elements = [];


        $scope.optionsDiagram = {
            chart: {
                type: 'historicalBarChart',
                height: 200,
                width: 500,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.1f')(d);
                },
                duration: 100,
                xAxis: {
                    axisLabel: 'Bike Available',
                    tickFormat: function(d) {
                        return d3.time.format('%H:%M')(new Date(d))
                    },
                    rotateLabels: 30,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        $scope.dataDiagram = [
            {
                //just for testing, will be overwritten
                "key" : "Bikes avialable" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            }];

        

        $scope.$on('updateMapObject', function(event, mapObject){
            if(!$scope.$$phase) {
                $scope.$apply(function(){
                    updateMapObject();
                });
            }else{
                updateMapObject();
            }
        });


        $scope.showDiagram = false;

        var updateDiagram = function(diagramType,diagramData) {
            $scope.showDiagram = true;


            if (diagramType == "historicalBarChart") {

                $scope.dataDiagram = [{key: "Bike Avialable", values: [],"bar":true}];

                var time = 0;
                var values = [];

                for(var i = 0;i<diagramData.length;i++)
                {
                    time = new Date("10/10/2016 "+diagramData[i].label);
                    values.push([time.getTime(),diagramData[i].value]);

                    //values.push([diagramData[i].label,diagramData[i].value]);


                }
                $scope.dataDiagram[0].values = values;





            }
        }


        var updateMapObject = function(){
            var mapObject = mapService.mapObjectForInformationPanel;
            $scope.elements = [];
            if (mapObject === undefined) return;
            for (i = 0; i < mapObject.elements.length; i++) {

                if (mapObject.elements[i].attribute) {
                    $scope.elements.push(mapObject.elements[i].attribute);
                }
            }

            if(mapObject.diagramType != "none")
            {
                //uh we have a diagram
                $scope.showDiagram = true;
                $scope.diagramTitle = mapObject.diagramTitle;
                updateDiagram(mapObject.diagramType,mapObject.diagramData);

            }
            else
            {
                $scope.showDiagram = false;
                $scope.diagramTitle = "";

            }
        };

        updateMapObject();
    }]);
