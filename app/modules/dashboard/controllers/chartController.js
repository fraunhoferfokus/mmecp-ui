/**
 * Created by mpo on 14.10.2015.
 */

var mainControllers = angular.module('app.dashboard.controllers',['app.common', 'app.dashboard.map.controller','angular-loading-bar', 'ngAnimate']);
mainControllers.controller('StatusPanelMainChartController', ['$scope','mapService', function($scope,mapService){

    console.log("loading Diagrams Controller");

    $scope.charts = mapService.charts;

    $scope.$watch("charts", function(newValue, oldValue) {

        for(var i = 0;i<$scope.charts.length;i++)
        {
            $scope.charts[i].chart.options = $scope.appendXYAndColor($scope.charts[i].chart.options,$scope.charts[i].chart.data);
        }

    });

    $scope.$on('chartUpdate', function(event, options){

        $scope.charts = mapService.charts;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    });

    $scope.appendXYAndColor = function(options,data)
    {
        console.log(options);
        options.chart.x = function(d){ return d.label; };
        options.chart.y = function(d){ return d.value; };
        //    options.chart['color'] = function(d){ return d.color; };

        var colors = [];

        for(var i = 0;i<data.length;i++)
        {
            colors.push(data[i].color);
        }

        options.chart.color = colors;

        return options;

    };



}]);