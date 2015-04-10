/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',[
])

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
                $scope.diagramCSS='medium-12 diagramMarginBottom';
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

    }])

    .run(function ( $rootScope, $log ){
        $log.log ("run dashboard controllers");
    });