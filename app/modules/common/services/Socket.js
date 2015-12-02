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
        var newMapObjectsObserver = [];
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
            console.log(res);

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

                for (var i = 0;i<newMapObjectsObserver.length;i++){
                    newMapObjectsObserver[i].notify();
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

                for (var j = 0;j<newMapObjectsObserver.length;j++){
                    newMapObjectsObserver[j].notify();
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
                newMapObjectsObserver.push(newObserver);
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




