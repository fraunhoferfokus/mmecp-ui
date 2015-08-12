/**
 * Created by lwi on 19.03.2015.
 */

function OLMap(config, rootboadcastEvent, mapService){

    this.layerGoogle = new OpenLayers.Layer.Google("google");
    this.layerOSM = new OpenLayers.Layer.OSM("OSM");
    this.activeLayer = this.layerOSM;
    this.config = config;

    var setSelected = function(feature, select){
        if (feature === null) return;

        if (select){
            feature.style.strokeWidth = feature.defaultStyle.select.strokeWidth;
            feature.style.fillColor = feature.defaultStyle.select.fillColor;
            feature.style.strokeColor = feature.defaultStyle.select.strokeColor;
        }else{
            feature.style.fillColor = feature.defaultStyle.fillColor.string;
            feature.style.strokeColor = feature.defaultStyle.strokeColor.string;
            feature.style.strokeWidth = feature.defaultStyle.strokeWidth;
        }
    };

    var selectedfeature = null;
    var olMap;
    this.olMap = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection("EPSG:4326"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        eventListeners: {
            nofeatureclick: function(e){
                if (selectedfeature !== null){
                    setSelected(selectedfeature, false);
                    selectedfeature.layer.redraw();
                    selectedfeature = null;
                }
                //rightMenuClass.closeRightPanel();
                rootboadcastEvent('closeMapObjectInformationPanel', null);
                //mapService.closeMapObjectInformationPanel();
                //mapService.hideInformation();
            },
            featureover: function(e) {
                e.feature.style.strokeWidth = 2;
                e.feature.layer.redraw();

            },
            featureout: function(e) {
                if (e.feature != selectedfeature){
                    e.feature.style.strokeWidth = 1;
                    e.feature.layer.redraw();
                }
            },

            featureclick: function(e) {
                if (selectedfeature == e.feature){
                    setSelected(selectedfeature, false);
                    rootboadcastEvent('closeMapObjectInformationPanel', null);
                    selectedfeature = null;
                }else{
                    if (selectedfeature !== null){
                        setSelected(selectedfeature, false);
                    }
                    selectedfeature = e.feature;
                    setSelected(e.feature, true);
                    var mapObject = olMap.getLayersByName(e.feature.layer.name)[0].getFeatureById(e.feature.id).mapObject;
                    mapService.mapObjectForInformationPanel = mapObject;
                    rootboadcastEvent('openMapObjectInformationPanel', null);
                    rootboadcastEvent('updateMapObject');
                }
                e.feature.layer.redraw();
            }
        }
    });

    olMap = this.olMap;

    this.olMap.addLayer(this.layerOSM);
    this.setCenter(this.config.default.city);

    this.vector = this.getParkingLayer();
    this.olMap.addLayer(this.vector);



    //experiments

    var berlin =  [{
        "type": "mapobject",
        "objectID": "BER_Crossing _ 03",
        "objectType": "CO2Emission",
        "objectSubtype": "DTVw",
        "description": "via_VMZ",
        "location": {
            "type": "Point",
            "coordinates": [
                13.286821,
                52.518842
            ]
        },
        "elements": [
            {
                "attribute": {
                    "label": "crossing_number",
                    "value": "1234"
                }
            },
            {
                "attribute": {
                    "label": "traffic_rate",
                    "value": "12345"
                }
            },
            {
                "attribute": {
                    "label": "co2 (est.)",
                    "value": "123"
                }
            },
            {
                "maparea": {
                    "area": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    13.286821,
                                    52.518842
                                ],
                                [
                                    13.286921,
                                    52.518842
                                ],
                                [
                                    13.286921,
                                    52.518942
                                ],
                                [
                                    13.286821,
                                    52.518942
                                ]
                            ]
                        ]
                    },
                    "color": {
                        "red": 125,
                        "green": 125,
                        "blue": 125,
                        "alpha": 0.5
                    }
                }
            }
        ]
    }
];


var tampere =[
    {
        "type": "mapobject",
        "objectID": "FNPK.11",
        "objectType": "ParkingStation",
        "objectSubtype": "cardblock",
        "description": "Parkingslot",
        "location": {
            "type": "Point",
            "coordinateSystem": "EPSG:2393",
            "coordinates": [
                3327571,
                6825825
            ]
        },
        "elements": [
            {
                "attribute": {
                    "label": "Trend",
                    "value": "decreasing"
                }
            },
            {
                "attribute": {
                    "label": "Status",
                    "value": "spacesAvailable"
                }
            },
            {
                "arrowedCircle": {
                    "circle": {
                        "x": 3327571,
                        "y": 6825825
                    },
                    "color": {
                        "red": 0,
                        "green": 125,
                        "blue": 0,
                        "alpha": 0.5
                    },
                    "arrowtype": "up",
                    "icon": "icon_green_arrow_up"
                }
            }
        ]
    },
    {
        "type": "mapobject",
        "objectID": "FNPK.11",
        "objectType": "ParkingStation",
        "objectSubtype": "cardblock",
        "description": "Parkingslot",
        "location": {
            "type": "Point",
            "coordinateSystem": "EPSG:2393",
            "coordinates": [
                3327677,
                6825503
            ]
        },
        "elements": [
            {
                "attribute": {
                    "label": "Trend",
                    "value": "stable"
                }
            },
            {
                "attribute": {
                    "label": "Status",
                    "value": "full"
                }
            },
            {
                "arrowedCircle": {
                    "circle": {
                        "x": 3327677,
                        "y": 6825503
                    },
                    "color": {
                        "red": 125,
                        "green": 0,
                        "blue": 0,
                        "alpha": 0.5
                    },
                    "arrowtype": "middle",
                    "icon": "icon_red_arrow_straight"
                }
            }
        ]
    }
]

    this.addObjects(berlin);
    this.addObjects(tampere);

}

OLMap.prototype.setCenter = function(city) {
    if (this.olMap === null) return;
    if (this.config === null) return;

    var lon, lat, zoom;
    if (city == this.config.coordinate.ROV.name) {
        lon = this.config.coordinate.ROV.lon;
        lat = this.config.coordinate.ROV.lat;
        zoom = this.config.coordinate.ROV.zoom;
    }else if (city == this.config.coordinate.BER.name) {
        lon = this.config.coordinate.BER.lon;
        lat = this.config.coordinate.BER.lat;
        zoom = this.config.coordinate.ROV.zoom;
    }else if (city == this.config.coordinate.TAM.name) {
        lon = this.config.coordinate.TAM.lon;
        lat = this.config.coordinate.TAM.lat;
        zoom = this.config.coordinate.ROV.zoom;
    }

    this.olMap.setCenter(new OpenLayers.LonLat(lon,lat) // Center of the map
            .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
        ), zoom // Zoom level
    );
};

OLMap.prototype.getmapAreaofMapObject = function(mapObject){
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea !== undefined){
            return mapObject.elements[i].maparea;
        }
    }
    return null;
};
OLMap.prototype.getCircleArrowOfMapObject = function(mapObject){
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].arrowedCircle !== undefined){
            return mapObject.elements[i].arrowedCircle;
        }
    }
    return null;
};


OLMap.prototype.addObjects = function (mapObjectList){


    console.log("start drawing map objects");
    //console.log(mapObjectList);
    console.log(mapObjectList.length);

    if (this.vector === undefined) return;
    for (i = 0;i<mapObjectList.length; i++){


        var mapObjectTyp = getMapObjectTyp(mapObjectList[i]);
        var fid = mapObjectList[i].objectID + ":" +
            mapObjectList[i].objectType + ":" +
            mapObjectList[i].objectSubtype;
        var feature;

        switch(mapObjectTyp)
        {
            case "arrowedCircle":
            {
                console.log("draw arrowCircles");
                var arrowCircle =  this.getCircleArrowOfMapObject(mapObjectList[i]);
                 feature = this.createArrowCircle(arrowCircle, fid);
                break;
            }
            case "mapArea":
            {
                console.log("draw polygon");
                var mapArea = this.getmapAreaofMapObject(mapObjectList[i]);
                feature = this.createPolygonFeature(mapArea, fid);

                break;
            }
        }
        feature.mapObject = mapObjectList[i];
        this.vector.addFeatures([feature]);


    }

};

OLMap.prototype.getParkingLayer = function(){
    vector = new OpenLayers.Layer.Vector("parkingLayer");
    return vector;
};

OLMap.prototype.createPolygonFeature = function(area, id){

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
};

OLMap.prototype.createArrowCircle = function(arrowCircle, id){


    var coords = arrowCircle.circle;
    var x = coords.x;
    var y = coords.y;


    //TAMPERE tranform

    Proj4js.defs["EPSG:2393"] = "+title= KKJ +proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +units=m +no_defs";
    console.log(Proj4js.defs["EPSG:2393"]);
    console.log(Proj4js.defs["EPSG:900913"]);
    var sourceCoords = new Proj4js.Proj("EPSG:2393");
    var destCoords = new Proj4js.Proj("EPSG:900913");
    destCoords.readyToUse = true;
    var p = new Proj4js.Point(x, y);
    console.log(sourceCoords);
    console.log(destCoords);
    console.log(p);

    console.log("there:");
    result = Proj4js.transform(sourceCoords, destCoords, p);
    console.log("Point:"+result);
    x= result.x;
    y= result.y;
    point = new OpenLayers.Geometry.Point(x, y,0);

    //END
    //Berlin tranform
    /*
    var x_berlin_test = 385432.25584348139818758;
    var y_berlin_test = 5815814.65779814217239618;
    x = x_berlin_test;
    y = y_berlin_test;
    Proj4js.defs["EPSG:32633"] = "+title= WGS 84 +proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

    var sourceCoords = new Proj4js.Proj("EPSG:32633");
    var destCoords = new Proj4js.Proj("EPSG:900913");
    var p = new Proj4js.Point(x, y);
    console.log(sourceCoords);
    console.log(destCoords);
    console.log(p);

    console.log("there:");
    result = Proj4js.transform(sourceCoords, destCoords, p);
    console.log("Point:"+result);
    x= result.x;
    y= result.y;
    point = new OpenLayers.Geometry.Point(x, y,0);
*/
    //END

    var iconPng = "img/"+arrowCircle.icon + ".png";


    var featureNewVector = new OpenLayers.Feature.Vector(
        point,
        {some:'data'},
        {externalGraphic: iconPng, graphicHeight: 28, graphicWidth: 47});

    featureNewVector.fid = id;


    featureNewVector.defaultStyle = {
        fillColor : {
            string : "rgba(" + arrowCircle.color.red + ", " + arrowCircle.color.green + ", " + arrowCircle.color.blue + ", " + arrowCircle.color.alpha + ")",
            red : arrowCircle.color.red,
            green : arrowCircle.color.green,
            blue : arrowCircle.color.blue,
            alpha : arrowCircle.color.alpha
        },
        strokeColor : {
            string : "rgba(" + arrowCircle.color.red + ", " + arrowCircle.color.green + ", " + arrowCircle.color.blue + ", " + arrowCircle.color.alpha + ")",
            red : arrowCircle.color.red,
            green : arrowCircle.color.green,
            blue : arrowCircle.color.blue,
            alpha : arrowCircle.color.alpha
        },
        select: {
            strokeColor: "rgba(0, 0, 0, 1)",
            fillColor: "rgba(" + arrowCircle.color.red + ", " + arrowCircle.color.green + ", " + arrowCircle.color.blue + ", " + 0.9 + ")",
            strokeWidth: 2
        },
        strokeWidth: 1
    };


    return featureNewVector;
};

function getMapObjectTyp(mapObject)
{
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea !== undefined){
            return "mapArea";
        }
        if (mapObject.elements[i].arrowedCircle !== undefined){
            return "arrowedCircle";
        }
    }
    return "unknown";
}