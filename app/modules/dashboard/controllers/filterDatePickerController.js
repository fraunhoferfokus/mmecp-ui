/**
 * Created by mpo on 03.05.2016.
 */

mainControllers.controller('filterDatePickerController', ['$scope','mapService','$rootScope','socketService',function($scope,mapService,$rootScope,socketService){


    $scope.showDatePicker = false;
    $scope.acutalRequest = null;
    $scope.actualFilterOption = null;
    $scope.showSingleDatePicker = false;
    console.log("filterDatePicker Init");

    $scope.headline = "Select a Time Period";

    $scope.date = {
        startDate: moment("01-05-2016", "DD-MM-YYYY"),
        endDate: moment()
    };

    $scope.dateSingle = {startDate: moment()};




    $scope.optsSingle = {

        singleDatePicker: true,
        timePicker: false,
         locale: {
         format: 'MM/DD/YYYY'
         }

    };


    $scope.opts = {
        ranges: {
            'Last 1 Day': [moment().subtract(1, 'days'), moment()],
            'Last 3 Days': [moment().subtract(2, 'days'), moment()],
            'Last 5 Days': [moment().subtract(4, 'days'), moment()],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()]
        },
        locale: {
            format: 'MM/DD/YYYY'
        },
        singleDatePicker: false,
        timePicker: false


    };

    $scope.setStartDate = function () {
        $scope.date.startDate = moment().subtract(4, "days");
        console.log("setStartDate")
    };

    $scope.setRange = function () {
        $scope.date = {
            startDate: moment().subtract(5, "days"),
            endDate: moment()
        };
    };

    $scope.$on('openDatePicker', function(event,filterOption){
        $scope.showDatePicker = true;
        $scope.actualFilterOption =  filterOption;
        $scope.acutalRequest = filterOption.requestActivated;

        if(filterOption.dialogs.onlyOneDay == true)
        {
            //only one day to select
            $scope.headline = "Select Date and Time";
            $scope.showSingleDatePicker = true;



        }
        else{
            //time range to select
            $scope.showSingleDatePicker = false;
            $scope.headline = "Select a Time Period";
        }

        console.log("acutalRequest");
        console.log($scope.acutalRequest);
        console.log(event);
        //$scope.$apply();

    });
    $scope.$on('closeDatePicker', function(event, args){
        $scope.showDatePicker = false;
        $scope.$apply();

    });

    $scope.$watch('dateSingle', function (value) {
        console.log("watch");
        console.log(value);
    });


    $scope.loadData = function()
    {







        if($scope.showSingleDatePicker == false) //range needs a end date
        {
            console.log("Dates Selected:");
            console.log($scope.date);
            $scope.acutalRequest.context.startDate  = moment($scope.date.startDate).format('DD-MM-YYYY');
            $scope.acutalRequest.context.endDate  = moment($scope.date.endDate).format('DD-MM-YYYY');
        }
        else
        {
            console.log("single Data Selected")
            $scope.acutalRequest.context.startDate  = moment($scope.dateSingle).format('DD-MM-YYYY');
            console.log($scope.dateSingle);

            $scope.acutalRequest.context.startWeekDay  = moment($scope.dateSingle).format('E');
            console.log($scope.acutalRequest.context.startDate)
            console.log("WeekDay: "+$scope.acutalRequest.context.startWeekDay);

        }

        console.log("Request Send");

        $rootScope.$broadcast("optionActivated", $scope.actualFilterOption);
         $rootScope.$broadcast('activateLoadingIcon');
         socketService.send($scope.acutalRequest);
         console.log($scope.acutalRequest);




         //close datePickerPanel
         $scope.showDatePicker = false;





    };











}]);
