/**
 * Created by lwi on 11.05.2015.
 */

angular.module('app.dashboard.map.services', ['app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives'])

.service('mapService', function(    ){

    this.mapObjectForInformationPanel = undefined;


        this.notifyFilterController;
        this.defaultCity = "ROV";
        this.registerNotifyMethod = function(notifyFilterController){
            this.notifyFilterController = notifyFilterController;
        };
        this.city = [];
        this.allCities = [];
        this.setAllCityObject = function(allCityObject){
            this.allCities[0] = allCityObject;
            console.log("set initial filter")
           // this.notifyFilterController.notify();

        };




});