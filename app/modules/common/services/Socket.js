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
            if(doInitRequest == true)
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

            try {

                //res = JSON.parse(event);
                //TODO: validate
                //var validator = new ZSchema();
                var schema = "schema.json";

                //var schemaMapObject = streetlifeSchema.getSchema(schema);
                //var valid = validator.validate(res, schemaMapObject);
                /*if (!valid) {
                 console.log("requested json File is not valid with schema " + schema);
                 console.log(validator.getLastErrors());
                 return null;
                 }*/
            } catch(e) {
                console.log("Error in onMessage in SocketService");
                res = {'username': 'anonymous', 'message': event};
            }

            //interpret message
            if (res.options != undefined) {
                //use case and filter object
                //$scope.$broadcast('receiveUseCaseEvent', "asdasdas");
                console.log("Backend Server recieve: all cities");
                console.log(res);
                mapService.setAllCityObject(res);

            }else {
                console.log("new map Object recieved");

                mapObjects.push(res);

                console.log("incoming message from server ... ");
                for (var i = 0;i<subject.length;i++){
                    subject[i].notify();
                }
            }




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




