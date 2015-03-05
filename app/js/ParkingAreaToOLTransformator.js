/**
 * Created by lwi on 20.02.2015.
 */

var getmapAreaofMapObject = function(mapObject){
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea != null){
            return mapObject.elements[i].maparea;
        }
    }
    return null;
}

var vector;
var addObjects = function (mapObjectList){

    if (vector == null) return;

    for (i = 0;i<mapObjectList.length; i++){
        var mapArea = getmapAreaofMapObject(mapObjectList[i]);
        var fid = mapObjectList[i].objectID + ":" +
            mapObjectList[i].objectType + ":" +
            mapObjectList[i].objectSubtype;
        var feature = createPolygonFeature(mapArea, fid);
        feature.mapObject = mapObjectList[i];
        vector.addFeatures([feature]);
    }
}

var getParkingLayer = function(){
    vector = new OpenLayers.Layer.Vector("parkingLayer");
    return vector;
};

var createPolygonFeature = function(area, id){

    var pointList = [],
        polygonGeometry,
        polygonFeature,
        vector = new OpenLayers.Layer.Vector('polygonLayerVector');

    var coords = area.area.coordinates[0];
    for (var i=0; i<coords.length; i++) {

        var point = new OpenLayers.Geometry.Point(coords[i][0], coords[i][1]);
        pointList.push(point);
    }

    var linearRing = new OpenLayers.Geometry.LinearRing(pointList).transform(
        new OpenLayers.Projection("EPSG:4326"),
        new OpenLayers.Projection("EPSG:900913"));

    var polygon = new OpenLayers.Geometry.Polygon([linearRing]);


    var style=  {
        fillColor: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
            strokeColor: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
            strokeWidth: 1
    };

    var newVector = new OpenLayers.Feature.Vector(polygon, null, style);

    newVector.fid = id;
    newVector.defaultStyle = {
        fillColor : {
            string : "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
            red : area.color.red,
            green : area.color.green,
            blue : area.color.blue,
            alpha : area.color.alpha
        },
        strokeColor : {
            string : "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
            red : area.color.red,
            green : area.color.green,
            blue : area.color.blue,
            alpha : area.color.alpha
        },
        select: {
            strokeColor: "rgba(0, 0, 0, 1)",
            fillColor: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + 0.9 + ")",
            strokeWidth: 2
        },
        strokeWidth: 1
    };

    return newVector;
}