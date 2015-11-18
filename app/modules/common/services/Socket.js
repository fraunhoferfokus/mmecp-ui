/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.socket', ['ngWebsocket', 'app.config', 'app.dashboard.map.services'])

    .factory('socketService', function($websocket, configService, mapService){
    // Open a WebSocket connection
        var ws = $websocket.$new({
            url: configService.socket.url,
            reconnect: true,
            reconnectInterval: 1000 // it will reconnect after 0.5 seconds
        });

        var mapObjects = [];
        var subject = [];
        var doInitRequest = true;







        ws.$on('$open', function () {
            console.log('connection open');
            console.log(mapService.city);
            if(doInitRequest === true)
            {
                var initialRequest = {
                    "context": {
                        "select": "Filter"
                    }
                };
                ws.$emit(JSON.stringify(initialRequest));
                doInitRequest = false;
            }
        });
        ws.$on('$message', function(event) {
            var res = event;

            /* res ={
             "mapobjects" : [ {
             "type" : "mapobject",
             "objectID" : "BER_Crossing _ 044 - 7319",
             "objectType" : "accidents",
             "objectSubtype" : "BER_dpcs",
             "description" : "via_VMZ",
             "location" : {
             "type" : "Point",
             "coordinates" : [ 13.286821, 52.518842 ]
             },
             "elements" : [ {
             "attribute" : {
             "label" : "street",
             "value" : "Manteuffelstr."
             }
             }, {
             "attribute" : {
             "label" : "accidents",
             "value" : "123"
             }
             }, {
             "maparea" : {
             "area" : {
             "system" : {
             "type" : "EPSG",
             "properties" : {
             "code" : 4326
             }
             },
             "type" : "polygon",
             "coordinateType" : "UTM",
             "coordinates" : [ [ {
             "zone" : "33N",
             "n" : 5813808.5,
             "e" : 389739.5
             }, {
             "zone" : "33N",
             "n" : 5813858.5,
             "e" : 389764.5
             }, {
             "zone" : "33N",
             "n" : 5813833.5,
             "e" : 389714.5
             }, {
             "zone" : "33N",
             "n" : 5813896.0,
             "e" : 389702.0
             }, {
             "zone" : "33N",
             "n" : 5813833.5,
             "e" : 389689.5
             }, {
             "zone" : "33N",
             "n" : 5813858.5,
             "e" : 389639.5
             }, {
             "zone" : "33N",
             "n" : 5813808.5,
             "e" : 389664.5
             }, {
             "zone" : "33N",
             "n" : 5813796.0,
             "e" : 389602.0
             }, {
             "zone" : "33N",
             "n" : 5813783.5,
             "e" : 389664.5
             }, {
             "zone" : "33N",
             "n" : 5813733.5,
             "e" : 389639.5
             }, {
             "zone" : "33N",
             "n" : 5813758.5,
             "e" : 389689.5
             }, {
             "zone" : "33N",
             "n" : 5813696.0,
             "e" : 389702.0
             }, {
             "zone" : "33N",
             "n" : 5813758.5,
             "e" : 389714.5
             }, {
             "zone" : "33N",
             "n" : 5813733.5,
             "e" : 389764.5
             }, {
             "zone" : "33N",
             "n" : 5813783.5,
             "e" : 389739.5
             }, {
             "zone" : "33N",
             "n" : 5813796.0,
             "e" : 389802.0
             } ] ]
             },
             "color" : {
             "red" : 131,
             "green" : 98,
             "blue" : 18,
             "alpha" : 0.9
             }
             }
             } ]
             } ]
             };


          /*  var res = {
                "mapobjects" : [ {
                    "type" : "mapobject",
                    "objectID" : "objIDu1",
                    "objectType" : "none",
                    "objectSubtype" : "BER_bk_rt_us",
                    "description" : "from_VMZ",
                    "location" : {
                        "type" : "Point",
                        "coordinates" : [ 13.13131313, 52.52525252 ]
                    },
                    "elements" : [ {
                        "maparea" : {
                            "area" : {
                                "system" : {
                                    "type" : "EPSG",
                                    "properties" : {
                                        "code" : 4326
                                    }
                                },
                                "type" : "line",
                                "coordinateType" : "GPS",
                                "coordinates" : [ [ 13.434421, 52.4962872 ], [ 13.4345261, 52.4963894], [ 13.4346462, 52.496506 ], [ 13.4320419, 52.497336 ], [ 13.4314011, 52.497582 ], [ 13.4307268, 52.4979106 ], [ 13.4285297, 52.4986754 ], [ 13.4271569, 52.4991273 ], [ 13.4264241, 52.4992601 ], [ 13.4240522, 52.4991992 ], [ 13.4188215, 52.4991608 ], [ 13.4186822, 52.4991584 ], [ 13.4186386, 52.4992068 ], [ 13.4185263, 52.4992763 ], [ 13.4183197, 52.4993353 ], [ 13.4182138, 52.4993385 ], [ 13.4181225, 52.4993197 ], [ 13.4179452, 52.499247 ], [ 13.4178483, 52.499161 ], [ 13.4178234, 52.4991153 ], [ 13.417662, 52.4990611 ], [ 13.4174445, 52.4990175 ], [ 13.4146628, 52.4986316 ], [ 13.4143374, 52.4986122 ], [ 13.4141117, 52.4986016 ], [ 13.4122293, 52.4986713 ], [ 13.411869, 52.4986517 ], [ 13.4104702, 52.4985856 ], [ 13.4088678, 52.4984817 ], [ 13.4076231, 52.4984504 ], [ 13.4066618, 52.4984556 ], [ 13.4069984, 52.4989397 ], [ 13.4075667, 52.4996661 ] ]
                            },
                            "color" : {
                                "red" : 255,
                                "green" : 0,
                                "blue" : 0,
                                "alpha" : 0.8
                            }
                        }
                    } ]
                } ]
            };*/


            //check if valid json
            if(typeof res == "string")
            {

                console.log("we got a string from backend");
                try {

                    res = JSON.parse(res);
                } catch (e) {
                    //alert("Backend doesn't send valid JSON");
                    return;
                }
            }

            //TODO: validate schema



            console.log("Message from Backend##############################################");
            //console.log(res);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //INTERPRETE MESSAGE FROM BACKEND
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////



            //
            // Initial Config JSON with all neccessary options,usecase ect. from backend
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (res.options !== undefined) {
                //use case and filter object
                //$scope.$broadcast('receiveUseCaseEvent', "asdasdas");
                console.log("New Message from Backend: all cities");
                console.log(res);
                mapService.setAllCityObject(res);
                return;

                
            }


            //
            // new charts/diagrams arrived
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(res.type == "charts")
            {
                console.log("New Message from Backend: charts");
                mapService.updateCharts(res);
                return;
            }



            //
            // new mapobjects arrived
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if(res.mapobjects !== undefined && res.mapobjects.length > 0){
            if(res.mapobjects[0].type == "mapobject") {
                console.log("New Message from Backend: mapobject");
                console.log("//////////////////////////////////////////////////////////////////////////////////////////");
                mapObjects.push(res.mapobjects);
                console.log(res);

                for (var i = 0;i<subject.length;i++){
                    subject[i].notify();
                }


                //if legend was send
                if(res.legend !== undefined) {
                    console.log("legend");
                    console.log(res.legend);
                    mapService.setMapLegend(res.legend);

                }

            }
                return;
            }

            if(res[0] !== undefined){
            if(res[0].type == "mapobject") {
                console.log("New Message from Backend: mapobject");
                mapObjects.push(res);
                console.log(res);

                for (var i = 0;i<subject.length;i++){
                    subject[i].notify();
                }
            }}


        });
        ws.$on('$error', function() {
            console.log('connection Error');
        });
        ws.$on('$close', function() {
            console.log('connection closed');
        });

        var lastCommandSends = [];
        return {
            getLastRecievedMapObject : function(){
                return mapObjects[mapObjects.length - 1];
            },
            addObserver: function(newObserver){
                console.log("add new Observer");
                subject.push(newObserver);
            },
            lastCommandSends: lastCommandSends,
            getLastCommmandSend: function(){
                return lastCommandSends[lastCommandSends.length-1];
            },
            mapObjects: mapObjects,
            status: function() {
                return ws.$ready();
            },
            send: function(message) {
                if (angular.isString(message)) {
                    this.lastCommandSends.push(message);
                    ws.$emit(message);
                    console.log("send via socket: " + message);
                }
                else if (angular.isObject(message)) {
                    ws.$emit(JSON.stringify(message));
                    console.dir("send via socket: " + message);
                }
            }
        };


    });




