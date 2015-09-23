/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',['app.common', 'app.dashboard.map.controller'])


    .controller('dashboardController', ['$scope','$log', '$rootScope','mapService','socketService', function($scope,$log, $rootScope,mapService,socketService) {

        console.log("DashboardController loaded");
        console.log(mapService.allCities);
        console.log("Dashboard Controller City");
        console.log(mapService.city);


        $scope.useCaseClicked = function(useCaseID)
        {
            console.log("Information: Clicked on UseCase:" + useCaseID);
            mapService.updateUseCase(useCaseID);

            console.log("todo: send chart request for useCase");
            console.log(mapService.actualUseCase);
            if(mapService.actualUseCase.requestChart != undefined)
            {
                socketService.send(mapService.actualUseCase.requestChart);
                console.log("Chart Request send for Usecase")
            }
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

    }]).controller('StatusPanelMainChartController', ['$scope','mapService', function($scope,mapService){

        console.log("loading Diagrams Controller");

        $scope.charts = mapService.charts;

        $scope.$watch("charts", function(newValue, oldValue) {

            for(var i = 0;i<$scope.charts.length;i++)
            {
                $scope.charts[i].chart.options = $scope.appendXYAndColor($scope.charts[i].chart.options,$scope.charts[i].chart.data);
            }

        });

        $scope.$on('chartUpdate', function(event, options){

            $scope.charts = mapService.charts;
            $scope.$apply();

        });

        $scope.appendXYAndColor = function(options,data)
        {
            console.log(options);
                options.chart['x'] = function(d){ return d.label; };
                options.chart['y'] = function(d){ return d.value; };
            //    options.chart['color'] = function(d){ return d.color; };

            var colors = [];

            for(var i = 0;i<data.length;i++)
            {
                colors.push(data[i].color);
            }

            options.chart['color'] = colors;

            return options;

        }



    }]);



