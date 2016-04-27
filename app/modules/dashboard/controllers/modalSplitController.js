/**
 * Created by mpo on 08.04.2016.
 */
/**
 * Created by mpo on 14.10.2015.
 */


/**
 * Created by mpo on 14.10.2015.
 */



mainControllers.service('modalSplitService', function(){
    var modalSplitParameter = {}

    return {
        setParameter: function(newParameter) {
            modalSplitParameter = newParameter;
        },
        getParameter:function(){
            return modalSplitParameter;
        }
    };
});





mainControllers.controller('modalSplitController', ['$scope','mapService','$rootScope','modalSplitService', function($scope,mapService,$rootScope,modalSplitService){


   $scope.modalSplitService = modalSplitService;



    // Without JQuery
   $scope.genderSlider = new Slider('#genderSlider', {
        formatter: function(value) {
            return 'Current value: ' + value;
        },

    });


    $scope.ageSlider = {"age14":null,"age14-19":null,"age20-29":null,"age30-39":null,"age40-49":null,"age50-59":null,"age60":null}



    $scope.totalPercentSum = 0;

    var drawPercentCircle = function(sliderId) {

        var percent = $scope.ageSlider[sliderId].getValue();
        //var percent = $scope.genderSliderAge14.getValue();

        var canvas = document.getElementById(sliderId + "Canvas");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 100, 100);


        //clear

        var radius_one_percent = 5;
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


    var calculateTotalSum = function() {
        var totalSum = 0;
        for (var sliderName in $scope.ageSlider) {
            if ($scope.ageSlider.hasOwnProperty(sliderName)) {

                var sum = $scope.ageSlider[sliderName].getValue();
                totalSum += sum;

            }
        }
        return totalSum;
    };

    var initAgeSlider = function(){
        for (var sliderName in $scope.ageSlider) {
            if ($scope.ageSlider.hasOwnProperty(sliderName))

                console.log("init of AgeSlider:"+sliderName);

                $scope.ageSlider[sliderName] =  new Slider('#'+sliderName, {
                    formatter: function(value) {
                        return 'Current value: ' + value;
                    },

                });
            }

        $scope.totalPercentSum = calculateTotalSum();

        $scope.modalSplitService.setParameter({gender: $scope.genderSlider,age:$scope.ageSlider})

    };

    initAgeSlider();

    $scope.simulateModalSplit = function()
    {
        $rootScope.$broadcast('openModalSplitTab', null);

    };


    $scope.regulateOthers = function(actualSliderId)
    {
        var totalSum = calculateTotalSum();
        console.log("TotalSum:" +totalSum);
        while(totalSum > 100)
        {

            for (var sliderName in $scope.ageSlider) {
                if ($scope.ageSlider.hasOwnProperty(sliderName)) {

                   if(actualSliderId != sliderName)
                   {
                       var percentOfSlider = $scope.ageSlider[sliderName].getValue()
                       console.log(sliderName+":"+percentOfSlider);
                       if(percentOfSlider > 0)
                       {
                           percentOfSlider--;
                           $scope.ageSlider[sliderName].setValue(percentOfSlider);
                           drawPercentCircle(sliderName);
                           totalSum = totalSum - 1;

                       }

                   }
                }
            }

        }
        $scope.totalPercentSum = totalSum;
        $scope.$apply();

    }


    $scope.ageSlider["age14"].on("change",function(e){
        var sliderName = "age14";

        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age14");

    $scope.ageSlider["age14-19"].on("change",function(e){
        var sliderName = "age14-19";

        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age14-19");

    $scope.ageSlider["age20-29"].on("change",function(e){
        var sliderName = "age20-29";

        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age20-29");


    $scope.ageSlider["age30-39"].on("change",function(e){
        var sliderName = "age30-39";

        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age30-39");

    $scope.ageSlider["age40-49"].on("change",function(e){
        var sliderName = "age40-49";

        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age40-49")


    $scope.ageSlider["age50-59"].on("change",function(e){
        var sliderName = "age50-59";

        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age50-59");


    $scope.ageSlider["age60"].on("change",function(e){
        var sliderName = "age60";
     
      
        $scope.regulateOthers(sliderName);
        drawPercentCircle(sliderName);
    });
    drawPercentCircle("age60");

    // Call a method on the slider
    var value = $scope.genderSlider.getValue();
    $scope.genderMale = value;
    $scope.genderFemale = 100 -value;

    $scope.genderSlider.on("change",function(){

        $scope.genderMale = $scope.genderSlider.getValue();
        $scope.genderFemale = 100 -$scope.genderMale;
        $scope.$apply();
        console.log($scope.genderMale);
    });

}]);

mainControllers.controller('modalSplitViewController', ['$scope','mapService','$rootScope','$http','modalSplitService', function($scope,mapService,$rootScope,$http,modalSplitService){

    $scope.modalSplitPieChartOptions = {
        chart: {
            type: 'pieChart',
            height: 500,
            width: 500,
            showLabels:true,
            x: function(d){return d.key;},
            y: function(d){return d.y},
            showLabels: true,
            duration: 500,
            labelThreshold: 0.05,
            color: ['lightskyblue', 'deepskyblue', 'darkred', 'yellowgreen'],
            donut: true,
            donutRatio:0.35


        }
    };





    $scope.headline = "Standard Modal Split Berlin (SrV2013)";

    var simulateModalSplit = function()
    {
        // Simple GET request example:

        var url = 'http://127.0.0.1:5000/messages';

        var ageDist = []
        var modalSplitParameter = modalSplitService.getParameter();
        for (var ageKey in modalSplitParameter.age) {
            ageDist.push(modalSplitParameter.age[ageKey].getValue()/100.00);
        }

        console.log(ageDist);

        var gender = modalSplitParameter.gender.getValue();
        var genderDist = [gender/100.00,1-gender/100.00];
        console.log(genderDist);

        var visitors = 2000;

        var data ={
            visitors:   visitors,
            gender: genderDist,     //[0.5,0.5]
            age: ageDist            //[0.142857,0.142857,0.142857,0.142857,0.142857,0.142857,0.142857]
        };


        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }

        $http(req).then(function(data){

                var labels = data.data.labels;
                var modalSplit = data.data.modalSplit;
                $scope.modalSplitPieChartData = []
                var entry = {}
                for(var i = 0;i<labels.length;i++)
                {
                    entry = {key:labels[i],y:modalSplit[i]/visitors*100}
                    $scope.modalSplitPieChartData.push(entry);
                }
                $scope.headline = "Simulated Modal Split";

            }
            , function(){
               console.log("problem with modal split forecast backendserver")
            }
        );




    }

    simulateModalSplit();



        //standard modal split berlin srv2013
    $scope.modalSplitPieChartData = [
        {
            key: "zu Fuss",
            y: 32
        },
        {
            key: "Fahrrad",
            y: 13
        },
        {
            key: "MIV",
            y: 28
        },
        {
            key: "OEPNV",
            y: 27

        }

    ];





}]);