/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.dashboard.controllers',[
])

    .controller('dashboardController', ['$scope','$log', function($scope,$log) {

        $scope.varShowHideMap=false;
        $scope.mapShowHide='medium-7';
        $scope.diagramsShowHide='medium-5';

        $scope.varShowHideKPIs=false;
        $scope.contentShowHide='medium-11';
        $scope.kipsShowHide='medium-1';

        $scope.diagram='medium-6';
        $scope.ShowHideMapIcon=false;
        $scope.showHideMap=function(){

            $scope.varShowHideMap = !$scope.varShowHideMap;
            $scope.ShowHideMapIcon = !$scope.ShowHideMapIcon;
            $log.log ($scope.varShowHideMap);

            if($scope.varShowHideMap==true){
                $scope.mapShowHide='medium-12';
                $scope.diagramsShowHide='medium-12 diagramMarginBottom';
                $scope.diagram='medium-3';
                if(($scope.varOverlayMapInfo==false)&&( $scope.varSwitchBetweenDiagrammsAndMapInfo==false)){
                    $scope.varOverlayMapInfo=true;
                    $scope.varSwitchBetweenDiagrammsAndMapInfo=true;
                }
            }else{
                $scope.mapShowHide='medium-7';
                $scope.diagramsShowHide='medium-5';
                $scope.diagram='medium-6';
                if($scope.varOverlayMapInfo==true){
                    $scope.varOverlayMapInfo=false;
                    $scope.varSwitchBetweenDiagrammsAndMapInfo=false;
                }
            }
        }
        $scope.showHideKPIs=function(){

            $scope.varShowHideKPIs = !$scope.varShowHideKPIs;
            $log.log ($scope.varShowHideKPIs)

            if($scope.varShowHideKPIs==false){
                $scope.contentShowHide='medium-11';
                $scope.kipsShowHide='medium-1'
            }else{
                $scope.contentShowHide='medium-12';
                $scope.kipsShowHide='medium-0'
            }
        }


        $scope.varSwitchBetweenDiagrammsAndMapInfo=true;
        $scope.varOverlayMapInfo=false;
        $scope.switchBetweenDiagrammsAndMapInfo=function(){

            if($scope.varShowHideMap==false){
                $scope.varSwitchBetweenDiagrammsAndMapInfo = !$scope.varSwitchBetweenDiagrammsAndMapInfo;
                $scope.varOverlayMapInfo=false;
            }else{
                $scope.varSwitchBetweenDiagrammsAndMapInfo = true;
                $scope.varOverlayMapInfo=!$scope.varOverlayMapInfo;
            }

        }

    }])

    .run(function ( $rootScope, $log ){
        $log.log ("run dashboard controllers")
    })