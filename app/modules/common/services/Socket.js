/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.socket', ['ngWebSocket', 'app.config'])

    .factory('socketService', function($websocket, configService){
    // Open a WebSocket connection
        var ws = $websocket(configService.socket.url);

        var mapObjects = [];
        var subject = [];

        ws.onMessage(function(event) {
            var res;
            try {

                res = JSON.parse(event.data);
                //TODO: validate
                //var validator = new ZSchema();
                var schema = "schema.json";

                //var schemaMapObject = streetlifeSchema.getSchema(schema);
                //var valid = validator.validate(res, schemaMapObject);
                if (!valid) {
                    console.log("requested json File is not valid with schema " + schema);
                    console.log(validator.getLastErrors());
                    return null;
                }
            } catch(e) {
                res = {'username': 'anonymous', 'message': event.data};
            }
            mapObjects.push(res);
            for (var i = 0;i<subject.length;i++){
                subject[i].notify();
            }
        });
        ws.onError(function(event) {
            console.log('connection Error', event);
        });
        ws.onClose(function(event) {
            console.log('connection closed', event);
        });
        ws.onOpen(function() {
            console.log('connection open');
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
                return ws.readyState;
            },
            send: function(message) {
                if (angular.isString(message)) {
                    this.lastCommandSends.push(message);
                    ws.send(message);
                }
                else if (angular.isObject(message)) {
                    ws.send(JSON.stringify(message));
                }
            }
        };
    });

