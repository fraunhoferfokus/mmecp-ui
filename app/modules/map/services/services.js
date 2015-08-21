/**
 * Created by lwi on 11.05.2015.
 */

angular.module('app.dashboard.map.services', ['app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives'])

.service('mapService', function(    ){

    this.mapObjectForInformationPanel = undefined;


        this.cityChangeNotifyList = [];
        this.cityChangNotifyAll = function()
        {
            for(var i = 0;i<this.cityChangeNotifyList.length;i++)
            {
                this.cityChangeNotifyList[i].notify();
            }
        }

        this.defaultCity = "ROV";
        this.registerNotifyCityChange= function(method){
            this.cityChangeNotifyList.push(method);
        };
        this.city = [];
        this.allCities = [];
        this.actualUseCase = [];
        this.setAllCityObject = function(allCityObject){
            this.allCities[0] = allCityObject;
            console.log("set initial filter");
            this.cityChangNotifyAll();

        };




});