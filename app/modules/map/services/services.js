/**
 * Created by lwi on 11.05.2015.
 */

angular.module('app.dashboard.map.services', ['app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives'])

.service('mapService',['$rootScope', function($rootScope    ){

    this.mapObjectForInformationPanel = undefined;





        this.defaultCity = "ROV";

        this.city = [];
        this.allCities = [];
        this.actualUseCase = [];
        this.setAllCityObject = function(allCityObject){
            this.allCities[0] = allCityObject;
            console.log("set initial city");
            this.updateSelectedCity(this.defaultCity);

        };




        this.updateSelectedCity = function(cityName){
            var city = cityName;
            var cityID = "";
            var cityOLMapID = "";
            var defaultUseCase = "";
            if (city == "ROV"){
                cityID = "Rovereto";
                cityOLMapID = "ROVERETO";
                defaultUseCase = "ParkAndRide@Rovereto";


            }else if (city == "BER"){
                cityID = "Berlin";
                cityOLMapID = "BERLIN";
                defaultUseCase = "CO2Emissions@Berlin";


            }else if (city == "TAM"){
                cityID = "Tampere";
                cityOLMapID = "TAMPERE";
                defaultUseCase = "ParkAndRide@Tampere";

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
            this.updateUseCase(defaultUseCase);


            //update map position
            $rootScope.$broadcast("changeCityOnMap",cityOLMapID);

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
                            this.actualUseCase[0] =  actualCity.useCases[useCase].options;

                        }

                    }
                }
            }
            $rootScope.$broadcast('useCaseListChanged', "fuu");

        };





    }]);