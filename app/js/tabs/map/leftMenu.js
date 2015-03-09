/**
 * Created by lwi on 05.03.2015.
 */

function LeftMenu(leftMenu, mapscope){
    leftMenuScope = leftMenu;
    map = mapscope;
};

LeftMenu.prototype.changeMap = function(scope){
    if (scope.map.activeLayer == scope.map.layerOSM){
        scope.map.olMap.removeLayer(scope.map.layerOSM);
        scope.map.olMap.addLayer(scope.map.layerGoogle);
        scope.map.activeLayer = scope.map.layerGoogle;
        showNotification("change map to gMap");
    }else if (scope.map.activeLayer == scope.map.layerGoogle){
        scope.map.olMap.removeLayer(scope.map.layerGoogle);
        scope.map.olMap.addLayer(scope.map.layerOSM);
        scope.map.activeLayer = scope.map.layerOSM;
        showNotification("change map to OSMap");
    }
};

LeftMenu.prototype.change = function(streetlifeSocket, checkbox){

    var removeParkingStation = function(map, layer, parkingStationString){
        var layer = map.getLayersByName(layer)[0];
        var featuresToRemove = [];
        for (i = 0;i<layer.features.length;i++){
            if (layer.features[i].mapObject.objectSubtype == parkingStationString){
                featuresToRemove.push(layer.features[i]);
            }
        }
        layer.removeFeatures(featuresToRemove);
    };


    if (checkbox == "macro"){
        if (leftMenuScope.confirmed_macro){
            streetlifeSocket.send("getObjectsOfType:ParkingAreas");
        }else{
            removeParkingStation(map, "parkingLayer", "macro");
        }
    }else if(checkbox == "micro"){
        if (leftMenuScope.confirmed_micro){
            leftMenuScope.confirmed_free = true;
            leftMenuScope.confirmed_fee = true;
            leftMenuScope.confirmed_clock = true;
            streetlifeSocket.send("getObjectsOfType:ParkingStationsFree");
            streetlifeSocket.send("getObjectsOfType:ParkingStationsFee");
            streetlifeSocket.send("getObjectsOfType:ParkingStationsClock");
        }else{
            leftMenuScope.confirmed_free = false;
            leftMenuScope.confirmed_fee = false;
            leftMenuScope.confirmed_clock = false;
            removeParkingStation(map, "parkingLayer", "forfree");
            removeParkingStation(map, "parkingLayer", "fee");
            removeParkingStation(map, "parkingLayer", "cardblock");
        }
    }else if(checkbox == "free"){
        if (leftMenuScope.confirmed_free){
            if (!leftMenuScope.confirmed_micro) leftMenuScope.confirmed_micro = true;
            streetlifeSocket.send("getObjectsOfType:ParkingStationsFree");
        }else{
            if (!leftMenuScope.confirmed_fee & !leftMenuScope.confirmed_clock) leftMenuScope.confirmed_micro = false;
            removeParkingStation(map, "parkingLayer", "forfree");
        }
    }else if(checkbox == "fee"){
        if (leftMenuScope.confirmed_fee){
            if (!leftMenuScope.confirmed_micro) leftMenuScope.confirmed_micro = true;
            streetlifeSocket.send("getObjectsOfType:ParkingStationsFee");
        }else{
            if (!leftMenuScope.confirmed_free & !leftMenuScope.confirmed_clock) leftMenuScope.confirmed_micro = false;
            removeParkingStation(map, "parkingLayer", "fee");
        }
    }else if(checkbox == "clock"){
        if (leftMenuScope.confirmed_clock){
            if (!leftMenuScope.confirmed_micro) leftMenuScope.confirmed_micro = true;
            streetlifeSocket.send("getObjectsOfType:ParkingStationsClock");
        }else{
            if (!leftMenuScope.confirmed_free & !leftMenuScope.confirmed_fee) leftMenuScope.confirmed_micro = false;
            removeParkingStation(map, "parkingLayer", "cardblock");
        }
    }
};