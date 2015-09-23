/**
 * Created by lwi on 22.04.2015.
 */

angular.module('app.dashboard.directives',[
])

    .directive('statusPanel', function(){
        return{
            restrict: 'E',
            template: '<b>BarChart </b><nvd3-discrete-bar-chart ' +
            'data="chartData" ' +
            'width="380" ' +
            'height="240" ' +
            'showXAxis="true" ' +
            'showYAxis="true" ' +
            'interactive="true" ' +
            'tooltips="true"' +
            'showLegend="true"' +
            'yAxisLabel="in %"' +
            'xAxisLabel="{{xAxis}}"' +
            '> ' +
            '<svg></svg></nvd3-discrete-bar-chart>'

        };
    })
    .directive('resizeMenu', ['$window', function ($window) {
        return function (scope, element) {
            var w = angular.element(window);
            scope.getWindowDimensions = function () {
                return { 'h': $(window).height(), 'w': $(window).width() };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.addStyle = function () {
                    return {
                        'height': (newValue.h - 45 ) + 'px',
                    };
                };
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        };
    }]);