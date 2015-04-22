/**
 * Created by lwi on 22.04.2015.
 */

angular.module('app.dashboard.directives',[
])

    .directive('statusPanel', function(){
        return{
            restrict: 'E',
            template: '<nvd3-line-chart data="exampleData" ' +
            'width="380" ' +
            'height="240" ' +
            'showXAxis="true" ' +
            'showYAxis="true" ' +
            'xAxisTickFormat="xAxisTickFormat_Date_Format()" ' +
            'yAxisTickFormat="yAxisFormatFunction()">  ' +
            '</nvd3-line-chart>',
            controller: 'StatusPanelController'
        };
    });