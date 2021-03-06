/**
 * Created by lwi on 11.05.2015.
 */

angular.module('app.dashboard.map.services', ['app.config', 'app.dashboard.map.directives','app.socket','app.socket'])

.service('mapService',['$rootScope', function($rootScope ){

    this.mapObjectForInformationPanel = undefined;

        console.log("Streetlife Project Console");/*RemoveLogging:skip*/

        this.accessToCities = [];

        //needed because only "dev" should see all cities
        this.setStreetlifeInstance = function()
        {
            this.streetlifeInstance = window.location.href;
            if(this.streetlifeInstance.indexOf("dev") > -1 || this.streetlifeInstance.indexOf("localhost") > -1)
            {
                this.streetlifeInstance = "dev";
                this.defaultCity = "BER";
                this.accessToCities = ["BER","ROV","TRE"];
            }
            if(this.streetlifeInstance.indexOf("berlin") > -1)
            {
                this.streetlifeInstance = "berlin";
                this.defaultCity = "BER";
                this.accessToCities = ["BER"];
            }
            if(this.streetlifeInstance.indexOf("rovereto") > -1)
            {
                this.streetlifeInstance = "rovereto";
                this.defaultCity = "ROV";
                this.accessToCities = ["ROV"];
            }
            if(this.streetlifeInstance.indexOf("tampere") > -1)
            {
                this.streetlifeInstance = "tampere";
                this.defaultCity = "TRE";
                this.accessToCities = ["TRE"];
            }


        };

        this.setStreetlifeInstance();


        this.city = [];
        this.allCities = [];
        this.actualUseCase = [];
        this.actualUsecaseOptions = [];
        this.charts = [];
        this.mapLegend = {};
        this.mapLegendKey = "";
        this.citiesDefaults = {};
        this.showOnlySelectedFeatureMode = {active: false}; //important in which style new features are added in the meanwhile

        this.activeOptions = [];
        this.legendList = [];


        this.registerActiveOption = function(activeOptionId)
        {
            this.activeOptions[activeOptionId] = true;
        };

        this.unRegisterActiveOption = function(activeOptionId)
        {
            this.activeOptions[activeOptionId] = false;
        };

        this.checkIfOptionIsActive = function(optionId)
        {

            if(this.activeOptions[optionId] !== undefined)
            {
                return this.activeOptions[optionId];
            }
            return false;
        };


        this.setCitiesDefaults=  function(citiesDefaults)
        {
            this.citiesDefaults = citiesDefaults;

        };

        this.putDefaultCityFirstInSelectionCombobox = function()
        {
            this.accessToCities = ["BER","ROV","TRE"];
            var indexOfDefaultCity = this.accessToCities.indexOf(this.defaultCity);
            if (indexOfDefaultCity > -1) {
                this.accessToCities.splice(index, 1);
            }
            this.accessToCities.unshift(this.defaultCity);

        };



        this.setMapLegend = function(legend)
        {

            //if multiply options are active only the latest legend will be shown
            legend.values = legend.values.reverse();
            this.removeMapLegend(legend.optionID); //remove old version of legend in case of existing
            this.legendList.push(legend);

            $rootScope.$broadcast('legendChanged');
            console.log("broadcast legend changed");
        };
        this.getMapLegend = function()
        {
            return this.mapLegend;
        };

        this.removeMapLegend = function(optionId)
        {

          for(var i = 0;i<this.legendList.length;i++)
          {

              if(this.legendList[i].id === optionId)
              {
                  var topLegendIndex = this.legendList.length-1;
                  this.legendList.splice(i,1);


                  if(i === topLegendIndex)
                  {

                      console.log("LEGEND TOP REMOVED");

                      //actual legend got removed
                      if(i > 0)
                      {
                          $rootScope.$broadcast('legendChanged');
                      }


                  }
              }
          }

        };



        this.deactivateCharts = function()
        {
            this.charts = [];
            $rootScope.$broadcast('chartUpdate');

        };


        this.setAllCityObject = function(allCityObject){

            this.allCities[0] = allCityObject;
            this.setCitiesDefaults(allCityObject.defaults);
            console.log(allCityObject.defaults);

          //  this.defaultCity = "BER"; //TODO: replace it with allCityObject.defaults.city
          //  this.putDefaultCityFirstInSelectionCombobox();
            this.updateSelectedCity(this.defaultCity);
        };



        this.removeOutDatedCharts = function(newCharts)
        {
            console.log("removeOutdated Charts");
            console.log(this.charts);

            console.log("new charts");
            console.log(newCharts);
           for(var i = 0;i<newCharts.length;i++)
            {
                for(var j = 0;j<this.charts.length;j++)
                {
                    if(this.charts[j].chartID == newCharts[i].chartID && this.charts[j].optionID == newCharts[i].optionID && this.charts[j].useCaseID == newCharts[i].useCaseID){
                        //delete outdated chart
                        this.charts.splice(j,1);
                    }
                }

            }


        };


        this.updateCharts = function(chartsObjects)
        {
            console.log(chartsObjects);


            console.log(chartsObjects);


            //remove old charts if a newer version arrives
            this.removeOutDatedCharts(chartsObjects.elements);


            var oldCharts = this.charts;
            this.charts = [];


            //add the new ones to the central charts list
            this.charts = this.charts.concat(chartsObjects.elements, oldCharts);
            console.log(this.charts);
            console.log("Update Charts here");
            $rootScope.$broadcast('chartUpdate');
            $rootScope.$broadcast('chartUpdateOption',chartsObjects.elements[0].chart.optionID);
        };



        this.updateSelectedCity = function(cityName){
            var city = cityName;
            var cityID = "";
            if (city == "ROV"){
                cityID = "Rovereto";
            }else if (city == "BER"){
                cityID = "Berlin";
            }else if (city == "TRE"){
                cityID = "Tampere";
            }


            for(var i = 0;i < this.allCities[0].options.length;i++) {
                var actualCity = this.allCities[0].options[i];
                if(actualCity.city == cityID)
                {
                    console.log("Information: City upated to: " + cityName);
                    this.city = actualCity;
                }

            }

            //set default usecase for city
            this.updateUseCase(this.city.defaultUseCase);


            //update map position
            $rootScope.$broadcast("changeCityOnMap",cityName);

            //load new filters
            console.log("update city");
            console.log(city);

        };

         this.updateUseCase = function(useCaseName)
        {
            console.log("Information: update Usecase to:" + useCaseName);
            for(var i = 0;i < this.allCities[0].options.length;i++) {
                var actualCity = this.allCities[0].options[i];

                if (actualCity.city ==  this.city.city) {

                    var useCases = actualCity.useCases;
                    for(var useCase in useCases) {

                        //workaround for @ symbols in icon names
                        //start
                        if(actualCity.useCases[useCase].icon.indexOf("@" > -1))
                        {
                            actualCity.useCases[useCase].icon = actualCity.useCases[useCase].icon.replace("@","at");
                        }
                        //end
                        //workaround

                        if(useCase == useCaseName)
                        {
                            console.log("Set Usecase "+useCaseName+"for City " + actualCity.city);
                            this.city[0] = actualCity.useCases[useCase].options;
                            this.actualUsecaseOptions[0] =  actualCity.useCases[useCase].options;
                            this.actualUseCase = actualCity.useCases[useCase];


                        }

                    }
                }
            }
            $rootScope.$broadcast('useCaseListChanged', useCaseName);


        };





    }]);
