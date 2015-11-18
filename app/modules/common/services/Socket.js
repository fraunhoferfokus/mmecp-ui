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
             }; */

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




