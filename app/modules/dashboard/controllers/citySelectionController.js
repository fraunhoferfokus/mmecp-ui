mainControllers.controller('citySelectionController',['$scope', 'socketService', 'mapService', '$rootScope', function citySelectionController ($scope, socketService, mapService, $rootScope) {
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

        if(mapService.actualUseCase.requestChart !== undefined)
        {
            socketService.send(mapService.actualUseCase.requestChart);
            console.log("Chart Request send for Usecase");
        }



    };

}]);