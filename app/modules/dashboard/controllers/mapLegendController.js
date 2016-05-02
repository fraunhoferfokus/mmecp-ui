/**
 * Created by mpo on 14.10.2015.
 */

mainControllers.controller('mapLegendController', ['$scope','mapService','$rootScope',function($scope,mapService,$rootScope){

    console.log("map LegendController");



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

        $scope.legendList = replaceEmptyLabels(mapService.legendList[mapService.legendList.length-1].values);
        $scope.legendKey = mapService.legendList[mapService.legendList.length-1].key;
        console.log("the key");
        console.log(mapService.legendList.length-1);
        console.log($scope.legendKey);


        $rootScope.showLegend = true;
        console.log( $scope.legendList );
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    });




    $scope.date = {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
    };

    $scope.opts = {
        ranges: {
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()]
        }
    };

    $scope.setStartDate = function () {
        $scope.date.startDate = moment().subtract(4, "days");
    };

    $scope.setRange = function () {
        $scope.date = {
            startDate: moment().subtract(5, "days"),
            endDate: moment()
        };
    };

    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        console.log('New date set: ', newDate);
    }, false);












}]);