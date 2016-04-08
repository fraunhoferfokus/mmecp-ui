/**
 * Created by mpo on 08.04.2016.
 */
/**
 * Created by mpo on 14.10.2015.
 */


/**
 * Created by mpo on 14.10.2015.
 */

mainControllers.controller('modalSplitController', ['$scope','mapService','$rootScope', function($scope,mapService,$rootScope){


    $scope.test = "hello";

    // Without JQuery
   $scope.slider = new Slider('#genderSlider', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });

    // AGE
    $scope.sliderAge14 = new Slider('#age14', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });


    var drawPercentCircle = function(sliderId) {
        var percent = $scope.sliderAge14.getValue();

        var canvas = document.getElementById(sliderId + "Canvas");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 200, 200);


        //clear

        var radius_one_percent = 10;
        var area_of_one_percent = radius_one_percent * radius_one_percent * Math.PI;

        var area_of_percent = area_of_one_percent * percent;

        var radius_of_percent = Math.sqrt(area_of_percent / Math.PI);


        context.beginPath();
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        context.arc(centerX, centerY, radius_of_percent, 0, Math.PI * 2, false);
        context.fillStyle = "#337ab7";
        context.fill();


        context.font = 'bold 12pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = "black";
        context.fillText(percent + "%", centerX, centerY + 3);

    };



    $scope.sliderAge14.on("change",function(){
        drawPercentCircle("age14");
    });

    drawPercentCircle("age14");







    //rst
    $scope.sliderAge14_19 = new Slider('#age14-19', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });
    $scope.sliderAge20_29 = new Slider('#age20-29', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });
    $scope.sliderAge30_39 = new Slider('#age30-39', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });
    $scope.sliderAge40_49 = new Slider('#age40-49', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });
    $scope.sliderAge50_59 = new Slider('#age50-59', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });
    $scope.sliderAge60 = new Slider('#age60', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });



    // Call a method on the slider
    var value = $scope.slider.getValue();
    $scope.genderMale = value;
    $scope.genderFemale = 100 -value;

    $scope.slider.on("change",function(){

        $scope.genderMale = $scope.slider.getValue();
        $scope.genderFemale = 100 -$scope.genderMale;
        $scope.$apply();
        console.log($scope.genderMale);
    });







}]);