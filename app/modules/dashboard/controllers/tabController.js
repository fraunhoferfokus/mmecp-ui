/**
 * Created by mpo on 14.10.2015.
 */


/**
 * Created by mpo on 14.10.2015.
 */

mainControllers.controller('tabController', ['$scope','mapService','$rootScope', function($scope,mapService,$rootScope){

    console.log("TabController");

    $scope.tabs = [
        { title:"Scenario", content:$scope.useCaseDescription },
        { title:"Traffic Rate", content:"Dynamic content 2" },
        { title:"Detail View", content:"Dynamic content 3" }
    ];



    $scope.optionHeadline = "";
    $scope.optionDescription = "";



    $scope.$on('optionActivated', function(event,option) {


        console.log(">>>>>>>>>>>>>><<<<<<<<<<<<<<<<<");
        console.log(option);
        $scope.optionHeadline = option.value;
        $scope.optionDescription = option.description;

        //workaround for firefox
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }


    });



    $scope.$on('useCaseListChanged', function(event,activeUseCaseName) {

        $scope.useCaseDescription = mapService.actualUseCase.description;
        console.log("------------------->");
        console.log($scope.useCaseDescription);

        $scope.tabs[0].content = $scope.useCaseDescription;

        //workaround for firefox
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }


    });


}]);