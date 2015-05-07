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
            '> ' +
            '<svg></svg></nvd3-discrete-bar-chart>',
            controller: 'StatusPanelController'
        };
    });