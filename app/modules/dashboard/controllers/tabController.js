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



    $scope.activeOptionDescriptionList = [];



    var removeOptionDescriptionFromViewPanel = function(optionID){

        for(var i = 0;i< $scope.activeOptionDescriptionList.length;i++)
        {
            console.log(optionID);
            if($scope.activeOptionDescriptionList[i].optionID == optionID)
            {
                $scope.activeOptionDescriptionList.splice(i,1);
                return;
            }
        }
    }




    $scope.$on('closeInformationTabIfEmpty',function(event,optionID)
        {
            if($scope.activeOptionDescriptionList.length == 0)
            {
               $rootScope.showInformation = false;
                $rootScope.showDetailView = false;
                $rootScope.showUseCaseDescription = true;
                $rootScope.showLegend = false;
            }
        }
    )

    $scope.$on('removeOptionDescriptionFromViewPanel', function(event,optionID) {

        removeOptionDescriptionFromViewPanel(optionID);
    });


    $scope.$on('optionActivated', function(event,option) {


        console.log(">>>>>>>>>>>>>><<<<<<<<<<<<<<<<<");
        console.log(option);



        var descriptionElement = {};
        descriptionElement.headline = option.value;
        descriptionElement.desc = option.description;
        descriptionElement.optionID = option.optionID;
        $scope.activeOptionDescriptionList.push(descriptionElement);


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