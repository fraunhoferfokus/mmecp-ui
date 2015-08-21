/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',['app.common', 'app.dashboard.map.controller'])

    .controller('dashboardController', ['$scope','$log', '$rootScope','mapService', function($scope,$log, $rootScope,mapService) {

        console.log("fuu");
        console.log(mapService.allCities);



        $scope.useCaseList = mapService.city.useCases;

        $scope.useCaseList = {
            "CO2Emissions@Berlin": {
                "title": "Berlin CO2Emission",
                "useCaseID": "CO2Emissions@Berlin",
                "icon": "co2emission@berlin.png",
                "options": [
                    {
                        "value": "vmz_data",
                        "id": "BerlinEvent_full",
                        "requestActivated": {
                            "useCaseID": "CO2Emissions@Berlin",
                            "context": {
                                "select": "CO2Emissions",
                                "where": {
                                    "id": "Berlin_full",
                                    "type": [
                                        "VMZ_traffic_volume_points"
                                    ]
                                }
                            },
                            "filter": [
                                "aggregate=last_day",
                                "time_band=all_day"
                            ]
                        },
                        "subType": "-",
                        "requested": false
                    }
                ]
            },
            "BikeSharing@Berlin": {
                "title": "Berlin Bike Sharin",
                "useCaseID": "BikeSharing@Berlin",
                "icon": "bikesharing@berlin.png",
                "options": [
                    {
                        "value": "Bike Sharing Stations",
                        "id": "BerlinEvent_full",
                        "requestActivated": {
                            "useCaseID": "BikeSharing@Berlin",
                            "context": {
                                "select": "BikeSharingStation",
                                "where": {}
                            },
                            "filter": [
                                "aggregate=last_day",
                                "time_band=all_day"
                            ]
                        },
                        "subType": "-",
                        "requested": false
                    }
                ]
            }
        };




        $scope.test = "1";
        $scope.showBigMap=false;
        $scope.mapCSS='medium-7-customer ';
        $scope.diagramCSS='medium-5-customer';

        $scope.showKPIs=true;
        $scope.contentCSS='medium-11-customer';
        $scope.kipsCSS='medium-1-customer ';

        $scope.singleDiagramCSS='medium-10-customer';
        $scope.showHideMap=function(){

            $scope.showBigMap = !$scope.showBigMap;

            if($scope.showBigMap===true){
                $scope.mapCSS='medium-12-customer medium-animate';
                $scope.diagramCSS='medium-0-customer medium-animate';
                $scope.singleDiagramCSS='medium-3-customer medium-animate';
                if(($scope.showOverlayMapInfo===false)&&( $scope.showDiagrams===false)){
                    $scope.showOverlayMapInfo=true;
                    $scope.showDiagrams=true;
                }
            }else{
                $scope.mapCSS='medium-7-customer medium-animate';
                $scope.diagramCSS='medium-5-customer medium-animate';
                $scope.singleDiagramCSS='medium-10-customer medium-animate';
                if($scope.showOverlayMapInfo===true){
                    $scope.showOverlayMapInfo=false;
                    $scope.showDiagrams=false;
                }
            }

            $scope.$emit('updateMap', null);
            $rootScope.$broadcast('updateMapObject', null);
        };
        $scope.showHideKPIs=function(){

            $scope.showKPIs = !$scope.showKPIs;
            $log.log ($scope.showKPIs);

            if($scope.showKPIs===true){
                $scope.contentCSS='medium-11-customer medium-animate';
                $scope.kipsCSS='medium-1-customer medium-animate';
            }else{
                $scope.contentCSS='medium-12-customer medium-animate';
                $scope.kipsCSS='medium-0-customer medium-animate';
            }
        };

        $scope.$on('showKPIsEvent', function (event, data) {
            console.log("on show KPI");
            $scope.showHideKPIs();
        });

        var mapObjectInformationPanelisOpen = function(){
            if ($scope.showDiagrams === false || $scope.showOverlayMapInfo === true){
                return true;
            }else{
                return false;
            }
        };

        $scope.$on('openMapObjectInformationPanel', function(event, args){
            //if closed, then open!
            if (!mapObjectInformationPanelisOpen()){
                $scope.$apply(function(){
                    $scope.switchBetweenDiagrammsAndMapInfo();
                });
            }

        });
        $scope.$on('closeMapObjectInformationPanel', function(event, args){
            //if opened, then close!
            if (mapObjectInformationPanelisOpen()){
                $scope.$apply(function(){
                    $scope.switchBetweenDiagrammsAndMapInfo();
                });
            }
        });

        $scope.showDiagrams=true;
        $scope.showOverlayMapInfo=false;
        $scope.switchBetweenDiagrammsAndMapInfo=function(){

            if($scope.showBigMap===false){
                $scope.showDiagrams = !$scope.showDiagrams;
                $scope.showOverlayMapInfo=false;
            }else{
                $scope.showDiagrams = true;
                $scope.showOverlayMapInfo=!$scope.showOverlayMapInfo;
            }
        };

    }]).controller('impressumnController', function mainController ($scope, $modal, $http) {
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.openImpressum = function (modalName) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/dashboard/partials/impressum.html',
                controller: 'modalController',
                resolve: {
                }
            });
        };
    }).controller('modalController', function modalController ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };
    }).controller('citySelectionController',['$scope', 'socketService', 'mapService', '$rootScope', function citySelectionController ($scope, socketService, mapService, $rootScope) {
        $scope.asd = function(city){
            $scope.citySelection.id = city;
            $scope.changeCity(city);
        };
        $scope.cities = [
            "BER",
            "ROV",
            "TAM"];
        $scope.citySelection = {};
        $scope.citySelection.id = $scope.cities[1];

        $scope.changeCity = function(newCity){

            //socketService.send("{'context':{'select': 'Filter'}}");
            console.log("new City: " + newCity);

            updateSelectedCity(newCity);
        };


        var newObserver = {
            notify : function(){
                console.log("set default city filter");
                updateSelectedCity(mapService.defaultCity);
            }
        };

        mapService.registerNotifyCityChange(newObserver);


        var updateUseCase = function(useCaseName)
        {
            console.log("Information: update Usecase to:" + useCaseName);
            for(var i = 0;i < mapService.allCities[0].options.length;i++) {
                var actualCity = mapService.allCities[0].options[i];

                if (actualCity.city ==  mapService.city.city) {

                    var useCases = actualCity.useCases;
                    for(var useCase in useCases) {

                        if(useCase == useCaseName)
                        {
                            console.log("Set Usecase "+useCaseName+"for City " + actualCity.city);
                            mapService.city[0] = actualCity.useCases[useCase].options;
                            mapService.actualUseCase[0] =  actualCity.useCases[useCase].options;
                        }

                    }
                }
            }

        };

        var updateSelectedCity = function(cityName){
            var city = cityName;
            var cityID = "";
            var cityOLMapID = "";
            var defaultUseCase = "";
            if (city == "ROV"){
                cityID = "Rovereto";
                cityOLMapID = "ROVERETO";
                defaultUseCase = "ParkAndRide@Rovereto";


            }else if (city == "BER"){
                cityID = "Berlin";
                cityOLMapID = "BERLIN";
                defaultUseCase = "CO2Emissions@Berlin";


            }else if (city == "TAM"){
                cityID = "Tampere";
                cityOLMapID = "TAMPERE";
                defaultUseCase = "ParkAndRide@Tampere";

            }




            for(var i = 0;i < mapService.allCities[0].options.length;i++) {
                var actualCity = mapService.allCities[0].options[i];
                if(actualCity.city == cityID)
                {
                    console.log("Information: City upated to: " + cityName);
                 mapService.city = actualCity;
                }

            }






            //set default usecase for city
          updateUseCase(defaultUseCase);


            //update map position
            $rootScope.$broadcast("changeCityOnMap",cityOLMapID);

            //load new filters

            console.log("update city");
            console.log(mapService.city);

        };

    }]).controller('StatusPanelController', ['$scope', function($scope){
        $scope.exampleDataStatusPanel = [
            {
                "key": "Series 1",
                "values": [
                    [ "Mo" , 1],
                    [ "Tu" , 5],
                    [ "We" , 15],
                    [ "Th" , 7],
                    [ "Fr" , 34],
                    [ "Sa" , 3],
                    [ "Su" , 6],
                ]
            }
        ];
    }]);



