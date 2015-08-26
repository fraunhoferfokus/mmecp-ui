/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',['app.common', 'app.dashboard.map.controller'])


    .controller('dashboardController', ['$scope','$log', '$rootScope','mapService', function($scope,$log, $rootScope,mapService) {

        console.log("DashboardController");
        console.log(mapService.allCities);
        console.log("Dashboard Controller City");
        console.log(mapService.city);


        $scope.useCaseClicked = function(useCaseID)
        {
            console.log("Information: Clicked on UseCase:" + useCaseID);
            mapService.updateUseCase(useCaseID);
            $scope.$apply();
        }


        $scope.useCaseList = mapService.city.useCases;

        $scope.$on('useCaseListChanged', function(event, args) {

            console.log("I am useCaseListChanged");
            $scope.useCaseList = mapService.city.useCases;


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






    }]).controller('StatusPanelController', ['$scope', function($scope){
        $scope.title = "";
        $scope.chartData = [
            {
                "key": "Series 1",
                "values": [
                    [ "Mo" , 1],
                    [ "Tu" , 5],
                    [ "We" , 15],
                    [ "Th" , 30],
                    [ "Fr" , 30],
                    [ "Sa" , 3],
                    [ "Su" , 6],
                ]
            }

        ];

    }]).controller('StatusPanel2Controller', ['$scope', function($scope) {
        $scope.chartData = [
            {
                "key": "Series 1",
                "values": [
                    ["Free", 50],
                    ["Occupied", 150]


                ]
            }

        ];


    }]);




