/**
 * Created by lwi on 08.06.2015.
 */

    angular.module('app.common',[])

    .controller('commonController', ['$scope', function($scope) {
        console.log("run commonController");

            $scope.showHideKPIs = function(){
               $scope.$broadcast('showKPIsEvent', {});
            };



    }]);