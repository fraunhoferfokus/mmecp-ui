/**
 * Created by lwi on 22.04.2015.
 */

angular.module('app.dashboard.directives',[
])

    .directive('statusPanel', function(){
        return{
            restrict: 'E',
            template: '<nvd3-discrete-bar-chart ' +
            'data="exampleDataStatusPanel" ' +
            'width="380" ' +
            'height="240" ' +
            'showXAxis="true" ' +
            'showYAxis="true" ' +
            'interactive="true" ' +
            'tooltips="true"' +
            'showLegend="true"' +
            'yAxisLabel="in %"' +
            'xAxisLabel="average occupancy per weekday"' +
            '> ' +
            '<svg></svg></nvd3-discrete-bar-chart>',
            controller: 'StatusPanelController'
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
                        'height': (newValue.h ) + 'px',
                    };
                };
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        };
    }]);