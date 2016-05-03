/**
 * Created by mpo on 03.05.2016.
 */

mainControllers.controller('filterDatePickerController', ['$scope','mapService','$rootScope','socketService',function($scope,mapService,$rootScope,socketService){


    $scope.showDatePicker = false;
    $scope.acutalRequest = null;
    $scope.actualFilterOption = null;

    $scope.date = {
        startDate: moment("01-05-2016", "DD-MM-YYYY"),
        endDate: moment()
    };

    $scope.opts = {
        ranges: {
            'Last 1 Day': [moment().subtract(1, 'days'), moment()],
            'Last 3 Days': [moment().subtract(2, 'days'), moment()],
            'Last 5 Days': [moment().subtract(4, 'days'), moment()],
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

    $scope.$on('openDatePicker', function(event,filterOption){
        $scope.showDatePicker = true;
        $scope.actualFilterOption =  filterOption;
        $scope.acutalRequest = filterOption.requestActivated;
        console.log("acutalRequest");
        console.log($scope.acutalRequest);
        console.log(event);
        //$scope.$apply();

    });
    $scope.$on('closeDatePicker', function(event, args){
        $scope.showDatePicker = false;
        $scope.$apply();

    });


    $scope.loadData = function()
    {

        console.log("Dates Selected:");
        console.log($scope.date);



        $scope.acutalRequest.context.startDate  = moment($scope.date.startDate).format('DD-MM-YYYY');
        $scope.acutalRequest.context.endDate  = moment($scope.date.endDate).format('DD-MM-YYYY');


        console.log("Request Send");

        $rootScope.$broadcast("optionActivated", $scope.actualFilterOption);
        $rootScope.$broadcast('activateLoadingIcon');
        socketService.send($scope.acutalRequest);
        console.log($scope.acutalRequest);

        //close datePickerPanel
        $scope.showDatePicker = false;




    };











}]);
