/**
 * Created by Aminskee on 10.03.15.
 */

mainControllers.controller('dashboardController', ['$scope','$log', '$rootScope','mapService','socketService','cfpLoadingBar', function($scope,$log, $rootScope,mapService,socketService,cfpLoadingBar) {

        console.log("DashboardController loaded");
        console.log(mapService.allCities);
        console.log("Dashboard Controller City");
        console.log(mapService.city);


        //VIEW FLAGS
        $rootScope.showDetailView = false;
        $rootScope.showUseCaseDescription = true;
        $rootScope.showCharts = true;
        $rootScope.showInformation = false;
        $rootScope.showLegend = false;


        //usecase description
        $scope.useCaseDescription = mapService.actualUseCase.description;
        $scope.useCaseTitle = mapService.actualUseCase.title;


        //option description
        $scope.OptionTitle = mapService.actualUseCase.title;

        $scope.activateLoading = false;

        $scope.$on('activateLoadingIcon', function(event) {
            cfpLoadingBar.start();
        });
        $scope.$on('deactivateLoadingIcon', function(event) {

            cfpLoadingBar.complete();

        });



        $scope.useCaseClicked = function(useCaseID)
        {
            //remove old
            console.log("### deactivate old usecase");
            $scope.$broadcast('deactivateAllActiveFilters');

            //activate default usecase views
            $rootScope.showDetailView = false;
            $rootScope.showUseCaseDescription = true;


            console.log("Information: Clicked on UseCase:" + useCaseID);
            mapService.updateUseCase(useCaseID);


            if(mapService.actualUseCase.requestChart !== undefined)

            {
                socketService.send(mapService.actualUseCase.requestChart);
                console.log("Chart Request send for Usecase");
            }
        };


        $scope.highlightActiveUseCaseIcon = function(activeUseCase)
        {

            for(var useCaseId in $scope.useCaseList) {

                //workaround for @ symbols in icon names
                //start
                if($scope.useCaseList[useCaseId].icon.indexOf("@") > -1)
                {
                    $scope.useCaseList[useCaseId].icon = $scope.useCaseList[useCaseId].icon.replace("@","at");
                }
                //end

                if(useCaseId == activeUseCase)
                {
                    //active clicked use case icon
                    if($scope.useCaseList[useCaseId].icon.indexOf("_active.png") == -1)
                    {

                        $scope.useCaseList[useCaseId].icon = $scope.useCaseList[useCaseId].icon.replace(".png","_active.png");
                    }

                }
                else
                {
                    //decative usecase icon if not actual any more
                   if($scope.useCaseList[useCaseId].icon.indexOf("_active.png" > -1))
                    {
                        $scope.useCaseList[useCaseId].icon = $scope.useCaseList[useCaseId].icon.replace("_active.png",".png");
                    }
                }
            }

        };


        $scope.useCaseList = mapService.city.useCases;

        $scope.$on('useCaseListChanged', function(event,activeUseCaseName) {

            console.log("I am useCaseListChanged" +activeUseCaseName);
            $scope.useCaseList = mapService.city.useCases;
            $scope.highlightActiveUseCaseIcon(activeUseCaseName);


            $scope.useCaseDescription = mapService.actualUseCase.description;
            $scope.useCaseTitle = mapService.actualUseCase.title;
            //workaround for firefox
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }


        });



        $scope.test = "1";
        $scope.showBigMap=false;
        $scope.mapCSS='medium-7-customer ';
        $scope.diagramCSS='medium-5-customer';

        $scope.showKPIs=true;
        $scope.contentCSS='medium-11-customer';
        $scope.kipsCSS='medium-1-customer ';

        $scope.singleDiagramCSS='medium-10-customer';




        $scope.$on('closeBigMap', function(event) {

            console.log("close bigMap");
            $scope.showBigMap = false;

            $scope.closeBigMap();
            $scope.$apply();


        });



        $scope.closeBigMap  = function()
        {
            $scope.mapCSS='medium-7-customer medium-animate';
            $scope.diagramCSS='medium-5-customer medium-animate';
            $scope.singleDiagramCSS='medium-10-customer medium-animate';
            if($scope.showOverlayMapInfo===true){
                $scope.showOverlayMapInfo=false;
                $scope.showDiagrams=false;
            }
        };




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

                $scope.closeBigMap();
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
            $rootScope.showDetailView = true;
            $rootScope.showUseCaseDescription = false;

        });
        $scope.$on('closeMapObjectInformationPanel', function(event, args){
            $rootScope.showDetailView = false;
            $rootScope.showUseCaseDescription = true;
            $scope.$apply();

        });


        //old needs to be removed
        $scope.showDiagrams=true;
        $scope.showOverlayMapInfo=false;


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
    });



