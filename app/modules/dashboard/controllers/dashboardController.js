/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',[])

    .controller('dashboardController', ['$scope','$log', '$rootScope', function($scope,$log, $rootScope) {

        $scope.showBigMap=false;
        $scope.mapCSS='medium-7';
        $scope.diagramCSS='medium-5';

        $scope.showKPIs=true;
        $scope.contentCSS='medium-11';
        $scope.kipsCSS='medium-1';

        $scope.singleDiagramCSS='medium-10';
        $scope.showHideMap=function(){

            $scope.showBigMap = !$scope.showBigMap;

            if($scope.showBigMap===true){
                $scope.mapCSS='medium-12';
                $scope.diagramCSS='medium-12 diagramMarginBottom display-none';
                $scope.singleDiagramCSS='medium-3';
                if(($scope.showOverlayMapInfo===false)&&( $scope.showDiagrams===false)){
                    $scope.showOverlayMapInfo=true;
                    $scope.showDiagrams=true;
                }
            }else{
                $scope.mapCSS='medium-7';
                $scope.diagramCSS='medium-5';
                $scope.singleDiagramCSS='medium-10';
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
                $scope.contentCSS='medium-11';
                $scope.kipsCSS='medium-1';
            }else{
                $scope.contentCSS='medium-12';
                $scope.kipsCSS='medium-0';
            }
        };

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
    }).controller('citySelectionController',['$scope', 'socketService', function citySelectionController ($scope, socketService) {
        $scope.citySelection = {};
        $scope.citySelection.id = "TAM";
        $scope.cities = [
            "BER",
            "ROV",
            "TAM"];

        $scope.$watch('citySelection.id', function(newValue, oldValue){
            var request = {
                "context": {
                    "select": "Filter"
                }
            };

        //socketService.send("{'context':{'select': 'Filter'}}");
            socketService.send(request);
        });
    }]).controller('StatusPanelController', ['$scope', function($scope){
        $scope.exampleDataStatusPanel = [
            {
                "key": "Series 1",
                "values": [
                    [ 0 , 1],
                    [ 1 , 5],
                    [ 2 , 15],
                    [ 3 , 7],
                    [ 4 , 34],
                    [ 5 , 3],
                    [ 6 , 6],
                    [ 7 , 5],
                    [ 8 , 8],
                    [ 9 , 12],
                ]
            }
        ];
    }]);

