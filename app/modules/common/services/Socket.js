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
                console.log("New Message from Backend: all cities");
                console.log(res);
                mapService.setAllCityObject(res);

               //sample call

                             var sample4Charts = {"type":"chartObject","elements":[
                    {"chart":{"title":"Parking Occupancy Rate","options":{"chart":{"type":"discreteBarChart","height":240,"width":380,"margin":{"top":20,"right":20,"bottom":60,"left":55},"showValues":true,"xAxis":{"axisLabel":"Parking Slots"},"yAxis":{"axisLabel":"Amount of Cars","axisLabelDistance":30}}},"data":[{"key":"Cumulative Return","values":[{"label":"Free","value":1532,"color":"#A5C989"},{"label":"Not Free","value":4321,"color":"#D16D82"}]}]}}
                    ,{"chart":{"title":"Parking Occupancy Rate","options":{"chart":{"type":"discreteBarChart","height":240,"width":380,"margin":{"top":20,"right":20,"bottom":60,"left":55},"showValues":true,"xAxis":{"axisLabel":"Parking Slots"},"yAxis":{"axisLabel":"Amount of Cars","axisLabelDistance":30}}},"data":[{"key":"Cumulative Return","values":[{"label":"Free","value":1532,"color":"#A5C989"},{"label":"Not Free","value":4321,"color":"#D16D82"}]}]}}
                    ,{"chart":{"title":"Parking Situation","options":{"chart":{"type":"pieChart","height":320,"showLabels":true,"transitionDuration":500,"labelThreshold":0.01,"legend":{"margin":{"top":5,"right":35,"bottom":5,"left":0}}}},"data":[{"label":"Free Parking Slots","value":500,"color":"#5D8896"},{"label":"Fee Parking Slots","value":3200,"color":"#5AC3E6"},{"label":"Clock Parking Slots","value":1300,"color":"#9CCBDB"}]}},{"chart":{"title":"Average Occupancy","options":{"chart":{"type":"discreteBarChart","height":240,"width":380,"margin":{"top":20,"right":20,"bottom":60,"left":55},"showValues":true,"xAxis":{"axisLabel":"Parking Slot Type"},"yAxis":{"axisLabel":"Percentage","axisLabelDistance":30}}},"data":[{"key":"Cumulative Return","values":[{"label":"Fee Slots","value":80,"color":"#D1D665"},{"label":"Clock Slots","value":60,"color":"#959951"}]}]}}]};



                var sample3Chart = {"type":"chartObject","elements":[
               {"chart":{"title":"Parking Occupancy Rate","options":{"chart":{"type":"discreteBarChart","height":240,"width":380,"margin":{"top":20,"right":20,"bottom":60,"left":55},"showValues":true,"xAxis":{"axisLabel":"Parking Slots"},"yAxis":{"axisLabel":"Amount of Cars","axisLabelDistance":30}}},"data":[{"key":"Cumulative Return","values":[{"label":"Free","value":1532,"color":"#A5C989"},{"label":"Not Free","value":4321,"color":"#D16D82"}]}]}}
                    ,{"chart":{"title":"Parking Situation","options":{"chart":{"type":"pieChart","height":320,"showLabels":true,"transitionDuration":500,"labelThreshold":0.01,"legend":{"margin":{"top":5,"right":35,"bottom":5,"left":0}}}},"data":[{"label":"Free Parking Slots","value":500,"color":"#5D8896"},{"label":"Fee Parking Slots","value":3200,"color":"#5AC3E6"},{"label":"Clock Parking Slots","value":1300,"color":"#9CCBDB"}]}},{"chart":{"title":"Average Occupancy","options":{"chart":{"type":"discreteBarChart","height":240,"width":380,"margin":{"top":20,"right":20,"bottom":60,"left":55},"showValues":true,"xAxis":{"axisLabel":"Parking Slot Type"},"yAxis":{"axisLabel":"Percentage","axisLabelDistance":30}}},"data":[{"key":"Cumulative Return","values":[{"label":"Fee Slots","value":80,"color":"#D1D665"},{"label":"Clock Slots","value":60,"color":"#959951"}]}]}}]};


                mapService.updateCharts(sample3Chart);

            }

            if(res.type == "charts")
            {
                mapService.updateCharts(res);
            }

            if(res[0].type == "mapobject") {
                console.log("New Message from Backend: mapobject");
                mapObjects.push(res);
                console.log(res);
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




