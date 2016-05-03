/**
 * Created by mpo on 14.10.2015.
 */


/**
 * Created by mpo on 14.10.2015.
 */

mainControllers.controller('tabController', ['$scope','mapService','$rootScope', function($scope,mapService,$rootScope){

    console.log("TabController");


    //VIEW FLAGS
    $scope.showDetailView = false;
    $scope.showUseCaseDescription = true;
    $scope.showInformation = false;
    $scope.showModalSplitSimulator = false;
    $scope.showModalSplit = false;
    $rootScope.showLegend = false;




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
    };


    var getOptionDescriptionIndex = function(optionID)
    {

        for(var i = 0;i< $scope.activeOptionDescriptionList.length;i++)
        {
            if($scope.activeOptionDescriptionList[i].optionID == optionID)
            {
                return i;
            }
        }
    };


    var addChartsToDescription = function(optionID)
    {

       var index =  getOptionDescriptionIndex(optionID);
        $scope.activeOptionDescriptionList[index].charts = [];
        var chartList = [];
        for(var i = 0;i<mapService.charts.length;i++)
        {
            if(mapService.charts[i].chart.optionID == optionID)
            {

                chartList.push(mapService.charts[i]);
            }
        }
        $scope.activeOptionDescriptionList[index].charts = chartList;
    };



    $scope.$on('chartUpdateOption',function(event,optionID)
    {

        addChartsToDescription(optionID);

    });


    $scope.$on('removeOptionDescriptionFromViewPanel', function(event,optionID) {
        removeOptionDescriptionFromViewPanel(optionID);
    });

    $scope.$on('optionActivated', function(event,option) {

        $scope.showInformation = true;
        console.log(">>>>>>>>>>>>>><<<<<<<<<<<<<<<<<");
        console.log(option);
        var descriptionElement = {};
        descriptionElement.headline = option.value;
        descriptionElement.desc = option.description;
        descriptionElement.optionID = option.optionID;
        $scope.activeOptionDescriptionList.unshift(descriptionElement);


        //workaround for firefox
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }


    });

    $scope.$on('openANewScenario',function(event,optionID)
    {
        $scope.showDetailView = false;
        $scope.showUseCaseDescription = true;


    });

    $scope.$on('closeInformationTabIfEmpty',function(event,optionID)
        {
            if($scope.activeOptionDescriptionList.length === 0)
            {
                $scope.showInformation = false;
                $scope.showDetailView = false;
                $scope.showUseCaseDescription = true;
                $rootScope.showLegend = false;
            }
        }
    );

    $scope.$on('openMapObjectInformationPanel', function(event, args){
        $scope.showDetailView = true;
        $scope.showUseCaseDescription = false;

    });
    $scope.$on('closeMapObjectInformationPanel', function(event, args){
        $scope.showDetailView = false;
        $scope.showUseCaseDescription = true;
        $scope.$apply();

    });

    $scope.$on('openModalSplitTab', function(event, args){
        $scope.showModalSplit = false;

        //workaround for firefox

            $scope.$apply();

        $scope.showModalSplit = true; //quick workaround for always focus on modal split tab after clicking the button
             $scope.$apply();


    });

    $scope.$on('openModalSplitSilmulator', function(event, args){
        $scope.showModalSplitSimulator = true;
        $scope.$apply();

    });

    $scope.$on('closeModalSplitSilmulator', function(event, args){
        $scope.showModalSplitSimulator = false;
        $scope.showModalSplit = false;
        $scope.$apply();


    });






    $scope.$on('useCaseListChanged', function(event,activeUseCaseName) {

        $scope.useCaseDescription = mapService.actualUseCase.description;
        console.log("------------------->");
        console.log($scope.useCaseDescription);

        console.log("activeUsecase:"+activeUseCaseName);

        //close special tabs
        $scope.showModalSplitSimulator = false;
        $scope.showModalSplit = false;




        //workaround for firefox
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }


    });


}]);