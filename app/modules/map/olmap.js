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
               e.feature.style.cursor = 'pointer';


            },
            featureout: function(e) {
                if (e.feature != selectedfeature){
                    e.feature.style.strokeWidth = 1;
                    e.feature.style.cursor = '';
                    e.feature.layer.redraw();
                }
            },

            featureclick: function(e) {
                //console.log("feature click");
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

    this.vector = this.getMapObjectsLayer();
    this.olMap.addLayer(this.vector);

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

OLMap.prototype.prepareMapData = function (mapObject){

    // sometimes elements contains "text$attribute" instead of "attribute"

    if(mapObject.elements === undefined)
    return mapObject;
    for (var i = 0;i<mapObject.elements.length;i++){

        var orginalKey = Object.keys(mapObject.elements[i])[0];
        key  = orginalKey.toLowerCase();
        if(key.indexOf("attribute") > -1 && key != "attribute")
        {
            //console.log(orginalKey);
            mapObject.elements[i].attribute = mapObject.elements[i][orginalKey];
            delete mapObject.elements[i][orginalKey];
        }
        if(key.indexOf("maparea") > -1 && key != "maparea")
        {
            mapObject.elements[i].maparea = mapObject.elements[i][orginalKey];
            delete mapObject.elements[i][orginalKey];
        }

    }

    return mapObject;
};


OLMap.prototype.generateMapObjectFeature = function (mapObjectTyp,mapObjectElement,fid){

    var feature;
    switch(mapObjectTyp)
    {
        case "arrowedCircle":
        {
            //console.log("draw arrowCircle " + i);
            var arrowCircle =  this.getCircleArrowOfMapObject(mapObjectElement);
            feature = this.createArrowCircleFeature(arrowCircle, fid);
            break;
        }
        case "mapArea":
        {

            var mapArea = this.getmapAreaofMapObject(mapObjectElement);
            if(mapArea.area.coordinateType == "UTM") {
                //console.log("draw polygon utm");
                feature = this.createPolygonFromUTMFeature(mapArea, fid);
            }
            else{
                //console.log("draw polygon normal");
                feature = this.createPolygonFeature(mapArea, fid);
            }

            break;
        }
    }
    return feature;

};



OLMap.prototype.addMapObjectToMap = function (mapObjectElement){

    var mapObjectTyp = this.getMapObjectTyp(mapObjectElement);
    var fid = mapObjectElement.objectID + ":" +
        mapObjectElement.objectType + ":" +
        mapObjectElement.objectSubtype;


    var feature = this.generateMapObjectFeature(mapObjectTyp,mapObjectElement,fid);

    feature.mapObject = mapObjectElement;

    //remove old mapobject with same fid if existing
    var existingMapObject = this.vector.getFeatureBy('fid', fid);
    if(existingMapObject)
    {
        this.vector.removeFeatures(existingMapObject);
    }


    this.vector.addFeatures([feature]);


};



OLMap.prototype.addObjects = function (mapObjectList){


    //console.log("start drawing map objects");

    if (this.vector === undefined) return;
    for (i = 0;i<mapObjectList.length; i++){

       mapObjectList[i] = this.prepareMapData(mapObjectList[i]);
        this.addMapObjectToMap(mapObjectList[i]);




    }

};

OLMap.prototype.getMapObjectsLayer = function(){
    vector = new OpenLayers.Layer.Vector("mapObjectsLayer");
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
    //console.log(polygon);
    var newVector = this.addPolygon(area,polygon,id);

    return newVector;
};

OLMap.prototype.addPolygon = function(area,polygon, id){


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



OLMap.prototype.createPolygonFromUTMFeature = function(area, id){


    //console.log("create with UTM");
    //console.log(area);
    var pointList = [],
        polygonGeometry,
        vector = new OpenLayers.Layer.Vector('polygonLayerVector');

    var coords = area.area.coordinates;
    Proj4js.defs["EPSG:32633"] = "+title= WGS 84 +proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    var sourceCoords = new Proj4js.Proj("EPSG:32633");
    var destCoords = new Proj4js.Proj("EPSG:900913");


    for (var i=0; i<coords.length; i++) {

        var point = new OpenLayers.Geometry.Point(coords[i].e, coords[i].n);
        //transform point into EPSG:900913

        //console.log(point);
        point =Proj4js.transform(sourceCoords, destCoords, point);
        //console.log("transform");
        //console.log(point);

  /*  var iconPng = "img/"+"icon_red_arrow_straight" + ".png";
        var featureNewVector = new OpenLayers.Feature.Vector(
            point,
            {some:'data'},
            {externalGraphic: iconPng, graphicHeight: 28, graphicWidth: 47})
        return featureNewVector;
    */

        pointList.push(point);
    }

    var linearRing = new OpenLayers.Geometry.LinearRing(pointList);


    var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
    //console.log("polygon");
    //console.log(polygon);
    var newVector = this.addPolygon(area,polygon,id);
    return newVector;
};


OLMap.prototype.getMapObjectTyp = function (mapObject)
{
    if(mapObject.elements === undefined)
        return "unkown";
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea !== undefined){
            return "mapArea";
        }
        if (mapObject.elements[i].arrowedCircle !== undefined){
            return "arrowedCircle";
        }
    }
    return "unknown";
};


OLMap.prototype.createArrowCircleFeature = function(arrowCircle, id){


    var coords = arrowCircle.circle;
    var x = coords.x;
    var y = coords.y;


    //TAMPERE tranform
    Proj4js.defs["EPSG:2393"] = "+title= KKJ +proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs";

    var sourceCoords = new Proj4js.Proj("EPSG:2393");
    var destCoords = new Proj4js.Proj("EPSG:900913");
    destCoords.readyToUse = true;
    var p = new Proj4js.Point(x, y);

    result = Proj4js.transform(sourceCoords, destCoords, p);

    x= result.x;
    y= result.y;

    var point = new OpenLayers.Geometry.Point(x, y,0);

    var iconPng = "img/"+arrowCircle.icon + ".png";


    var scaleFactor = 0.6;
    var featureNewVector = new OpenLayers.Feature.Vector(
        point,
        {some:'data'},
        {externalGraphic: iconPng, graphicHeight: 100*scaleFactor, graphicWidth: 75*scaleFactor});


   /* var featureNewVector = new OpenLayers.Feature.Vector(
        point,
        {some:'data'}); */



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

