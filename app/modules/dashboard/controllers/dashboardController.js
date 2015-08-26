/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',['app.common', 'app.dashboard.map.controller'])


    .controller('dashboardController', ['$scope','$log', '$rootScope','mapService','socketService', function($scope,$log, $rootScope,mapService,socketService) {

        console.log("DashboardController");
        console.log(mapService.allCities);
        console.log("Dashboard Controller City");
        console.log(mapService.city);


        $scope.useCaseClicked = function(useCaseID)
        {
            console.log("Information: Clicked on UseCase:" + useCaseID);
            mapService.updateUseCase(useCaseID);
            console.log("todo: send chart request for useCase");
        }


        $scope.highlightActiveUseCaseIcon = function(activeUseCase)
        {

            for(var useCaseId in $scope.useCaseList) {

                //workaround for @ symbols in icon names
                //start
                if($scope.useCaseList[useCaseId].icon.indexOf("@") > -1)
                {
                    $scope.useCaseList[useCaseId].icon = $scope.useCaseList[useCaseId].icon.replace("@","at");
                }
                //end

                if(useCaseId == activeUseCase)
                {
                    //active clicked use case icon
                    if($scope.useCaseList[useCaseId].icon.indexOf("_active.png") == -1)
                    {

                        $scope.useCaseList[useCaseId].icon = $scope.useCaseList[useCaseId].icon.replace(".png","_active.png");
                    }

                }
                else
                {
                    //decative usecase icon if not actual any more
                   if($scope.useCaseList[useCaseId].icon.indexOf("_active.png" > -1))
                    {
                        $scope.useCaseList[useCaseId].icon = $scope.useCaseList[useCaseId].icon.replace("_active.png",".png");
                    }
                }
            }

        };


        $scope.useCaseList = mapService.city.useCases;

        $scope.$on('useCaseListChanged', function(event,activeUseCaseName) {

            console.log("I am useCaseListChanged" +activeUseCaseName);
            $scope.useCaseList = mapService.city.useCases;
            $scope.highlightActiveUseCaseIcon(activeUseCaseName);


        });




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
        $scope.cities = mapService.accessToCities;
        $scope.citySelection = {};
        $scope.citySelection.id = $scope.cities[0];

        $scope.changeCity = function(newCity){

            //socketService.send("{'context':{'select': 'Filter'}}");
            console.log("new City: " + newCity);
            mapService.updateSelectedCity(newCity);
        };






    }]).controller('StatusPanelChartOneController', ['$scope', function($scope){
        $scope.data = [];
        $scope.options = {};

        $scope.$on('chartOneUpdate', function(event, options,data){
            console.log("chartOneUpdate");
            console.log(data);
           $scope.data = data;
           $scope.options = options;

        });


    }]).controller('StatusPanelChartTwoController', ['$scope', function($scope) {

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 240,
                width: 380,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                transitionDuration: 500,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];


    }]).controller('StatusPanelChartThreeController', ['$scope', function($scope) {
        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 240,
                width: 380,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,

                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 30
                }
            }
        };

        $scope.data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "A" ,
                        "value" : -29.765957771107
                    } ,
                    {
                        "label" : "B" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "C" ,
                        "value" : 32.807804682612
                    } ,
                    {
                        "label" : "D" ,
                        "value" : 196.45946739256
                    } ,
                    {
                        "label" : "E" ,
                        "value" : 0.19434030906893
                    } ,
                    {
                        "label" : "F" ,
                        "value" : -98.079782601442
                    } ,
                    {
                        "label" : "G" ,
                        "value" : -13.925743130903
                    } ,
                    {
                        "label" : "H" ,
                        "value" : -5.1387322875705
                    }
                ]
            }
        ]

    }]);



