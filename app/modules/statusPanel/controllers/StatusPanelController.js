/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.statusPanel', ['app.dashboard.map.directives', 'nvd3ChartDirectives'])

    .controller('StatusPanelController', ['$scope', function($scope){
        $scope.exampleDataStatusPanel = [
            {
                "key": "Series 1",
                "values": [
                    [ 0 , 1],
                    [ 1 , 5],
                    [ 2 , 15],
                    [ 3 , 7],
                    [ 4 , 34],
                    [ 5 , 3],
                    [ 6 , 6],
                    [ 7 , 5],
                    [ 8 , 8],
                    [ 9 , 12],
                ]
            }
        ];
    }]);