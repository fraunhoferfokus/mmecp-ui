/**
 * Created by lwi on 11.05.2015.
 */

angular.module('app.dashboard.map.services', ['app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives'])

.service('mapService', function(    ){

    this.mapObjectForInformationPanel = undefined;


        this.notifyFilterController;
        this.setAllCityObject = function(allCityObject){
            this.allCities[0] = allCityObject;
            this.notifyFilterController();
        };
        this.defaultCity = "ROV";
        this.registerNotifyMethod = function(notifyFilterController){
            this.notifyFilterController = notifyFilterController;
        };
        this.city = [];

        this.allCities = [
            {
                "options": [
                    {
                        "city": "Rovereto",
                        "title": "park and ride",
                        "useCaseID": "ParkAndRide@Rovereto",
                        "options": [
                            {
                                "value": "ParkingAreas",
                                "id": "parkandride:ParkingAreas",
                                "request": {
                                    "useCaseID": "ParkAndRide@Rovereto",
                                    "context": {
                                        "select": "ParkingArea"
                                    }
                                },
                                "subType": "macro",
                                "requested": false
                            },
                            {
                                "value": "ParkingStationsFree",
                                "id": "parkandride:ParkingStationsFree",
                                "request": {
                                    "useCaseID": "ParkAndRide@Rovereto",
                                    "context": {
                                        "select": "ParkingArea",
                                        "where": {
                                            "type": [
                                                "free"
                                            ]
                                        }
                                    }
                                },
                                "subType": "free",
                                "requested": false
                            },
                            {
                                "value": "ParkingStationsFee",
                                "id": "parkandride:ParkingStationsFee",
                                "request": {
                                    "useCaseID": "ParkAndRide@Rovereto",
                                    "context": {
                                        "select": "ParkingArea",
                                        "where": {
                                            "type": [
                                                "fee"
                                            ]
                                        }
                                    }
                                },
                                "subType": "fee",
                                "requested": false
                            },
                            {
                                "value": "ParkingStationsClock",
                                "id": "parkandride:ParkingStationsClock",
                                "request": {
                                    "useCaseID": "ParkAndRide@Rovereto",
                                    "context": {
                                        "select": "ParkingArea",
                                        "where": {
                                            "type": [
                                                "clock"
                                            ]
                                        }
                                    }
                                },
                                "subType": "clock",
                                "requested": false
                            }
                        ]
                    },
                    {
                        "city": "Berlin",
                        "title": "Berlin Event",
                        "useCaseID": "ParkAndRide@Berlin",
                        "options": [
                            {
                                "value": "events",
                                "id": "BerlinEvent:events",
                                "request": "xxx:xxx",
                                "subType": "-",
                                "requested": false
                            },
                            {
                                "value": "streetwork",
                                "id": "BerlinEvent:streetwork",
                                "subType": "-",
                                "request": "xxx:xxx",
                                "requested": false
                            },
                            {
                                "value": "...",
                                "id": "BerlinEvent:...",
                                "request": "xxx:xxx",
                                "subType": "-",
                                "requested": false
                            }
                        ]
                    }
                ]
            }
        ];
});