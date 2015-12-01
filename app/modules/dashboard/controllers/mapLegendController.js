/**
 * Created by mpo on 14.10.2015.
 */

mainControllers.controller('mapLegendController', ['$scope','mapService','$rootScope', function($scope,mapService,$rootScope){

    console.log("map LegendController");


    $scope.test = " hello legend";
    $scope.legendList = mapService.mapLegend;

    var replaceEmptyLabels = function(legendList)
    {
        for(var i = 0;i<legendList.length;i++)
        {
            if(legendList[i].label === "")
            {
                legendList[i].label = " ";
            }
        }
        return legendList;
    };


    $scope.$on('legendChanged', function(event, options){

        console.log("recieved broadcast legend changed");
        $scope.legendList = replaceEmptyLabels(mapService.mapLegend);
        $scope.legendKey = mapService.mapLegendKey;
        console.log( $scope.legendList );
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    });



}]);