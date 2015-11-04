/**
 * Created by lwi on 19.03.2015.
 */

function OpenLayer3Map(config, rootbroadcastEvent, mapService){

    this.vectorOfMapObjects= new ol.source.Vector({
        features: [ ]
    });


    var vectorLayer = new ol.layer.Vector({
        source:  this.vectorOfMapObjects
    });



    var selectedFeature = undefined;

    this.config = config;

    this.map = new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([37.41, 8.82]),
            zoom: 4
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'osm'})
            })
        ],
        target: 'map'

    });

    var osmSource = new ol.source.OSM();
    var osmLayer = new ol.layer.Tile({source: osmSource});
    this.map.addLayer(osmLayer);
    this.map.addLayer(vectorLayer);



    var defaultHighlightStyle =  new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(255,0,0,1)",
            width: 3
        })

    });




    this.map.on('singleclick', function(evt) {
        var feature = this.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {

                //unselect previous selected feature
                if(selectedFeature !== undefined)
                {
                    selectedFeature.setStyle(selectedFeature.unSelectedStyle);
                }

                selectedFeature = feature;

                if(feature.highlightStyle !== undefined)
                {
                    feature.setStyle(feature.highlightStyle);

                }
                else
                {
                    feature.setStyle(defaultHighlightStyle);
                }



                mapService.mapObjectForInformationPanel = feature.mapObject;
                rootbroadcastEvent('openMapObjectInformationPanel',null);
                rootbroadcastEvent('updateMapObject');


                return [feature, layer];
            });

        console.log(selectedFeature);
        if(feature === undefined)
        {
            //no feature selected, close detail view
            rootbroadcastEvent('closeMapObjectInformationPanel', null);

            //unselect previous selected feature
            if(selectedFeature !== undefined)
            {
                selectedFeature.setStyle(selectedFeature.unSelectedStyle);
            }
        }


    });



    this.setCenter(this.config.default.city);






};

OpenLayer3Map.prototype.setCenter = function(city) {
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

    console.log("OpenLayers Action: change center");
    console.log("Long: " + lon + " Lat: " + lat);
    this.map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:900913'));
    this.map.getView().setZoom(zoom);


};

OpenLayer3Map.prototype.getmapAreaofMapObject = function(mapObject){
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea !== undefined){
            return mapObject.elements[i].maparea;
        }
    }
    return null;
};
OpenLayer3Map.prototype.getCircleArrowOfMapObject = function(mapObject){
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].arrowedCircle !== undefined){
            return mapObject.elements[i].arrowedCircle;
        }
    }
    return null;
};

OpenLayer3Map.prototype.prepareMapData = function (mapObject){

    // sometimes elements contains "text$attribute" instead of "attribute"

    if(mapObject.elements == undefined)
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


OpenLayer3Map.prototype.generateMapObjectFeature = function (mapObjectTyp,mapObjectElement,fid){

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
                feature = this.createPolygonFeature(mapArea, fid,'EPSG:4326');
            }

            break;
        }
    }
    return feature;

}


OpenLayer3Map.prototype.addMapObjectToMap = function (mapObjectElement){

    var mapObjectTyp = this.getMapObjectTyp(mapObjectElement);
    var fid = mapObjectElement.objectID + ":" +
        mapObjectElement.objectType + ":" +
        mapObjectElement.objectSubtype;



    var feature = this.generateMapObjectFeature(mapObjectTyp,mapObjectElement,fid);

    feature.mapObject = mapObjectElement;

    this.removeFeatureIfExisting(fid);

    this.vectorOfMapObjects.addFeatures([feature]);


};


OpenLayer3Map.prototype.removeFeatureIfExisting = function(fid)
{
    var features = this.vectorOfMapObjects.getFeatures();
    for(var i = 0;i<features.length;i++)
    {
        var feature = features[i];
        if(feature.id == fid)
        {
            this.vectorOfMapObjects.removeFeature(feature);
        }
    }
}


OpenLayer3Map.prototype.removeAllFeatures = function()
{
    this.vectorOfMapObjects.clear();
}


OpenLayer3Map.prototype.removeFeaturesWithSubType = function(subType)
{
    var features = this.vectorOfMapObjects.getFeatures();
    for(var i = 0;i<features.length;i++)
    {
        var feature = features[i];
        if(feature.mapObject.objectSubtype == subType)
        {
            this.vectorOfMapObjects.removeFeature(feature);
        }
    }
}


OpenLayer3Map.prototype.addObjects = function (mapObjectList){

    console.log("start drawing map objects");

    for (i = 0;i<mapObjectList.length; i++){

        console.log(".......x");
        mapObjectList[i] = this.prepareMapData(mapObjectList[i]);
        this.addMapObjectToMap(mapObjectList[i]);




    }

};


OpenLayer3Map.prototype.createPolygonFeature = function(area, id,sourceCoordSystem){


    var coords = area.area.coordinates[0];

    var feature = new ol.Feature({
        geometry: new ol.geom.Polygon([coords])
    });

    var polyStyle = new ol.style.Style({

        fill: new ol.style.Fill({
            color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")"
        }),
        stroke: new ol.style.Stroke({
            color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
            width: 1
        }),
    });

    var highlightStyle = new ol.style.Style({

        fill: new ol.style.Fill({
            color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")"
        }),
        stroke: new ol.style.Stroke({
            color: "rgba(0,0,0,1)",
            width: 3
        }),
    });

    feature.highlightStyle =  highlightStyle;
    feature.unSelectedStyle = polyStyle;


    feature.setStyle(polyStyle);
    if(sourceCoordSystem !== undefined)
    {
        feature.getGeometry().transform(sourceCoordSystem, 'EPSG:900913');
    }
    feature.id = id;
    return feature;



};

OpenLayer3Map.prototype.createPolygonFromUTMFeature = function(area, id){

    var pointList = [];
    var coords = area.area.coordinates;
    Proj4js.defs["EPSG:32633"] = "+title= WGS 84 +proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    var sourceCoords = new Proj4js.Proj("EPSG:32633");
    var destCoords = new Proj4js.Proj("EPSG:900913");


    for (var i=0; i<coords.length; i++) {


        var point = new Proj4js.Point(coords[i].e, coords[i].n);
        point =Proj4js.transform(sourceCoords, destCoords, point);

        pointList.push([point.x,point.y]);
    }

    area.area.coordinates = [pointList];
     return this.createPolygonFeature(area,id,undefined);


};


OpenLayer3Map.prototype.getMapObjectTyp = function (mapObject)
{
    if(mapObject.elements == undefined)
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


OpenLayer3Map.prototype.createArrowCircleFeature = function(arrowCircle, id) {


    console.log("Draw icons");

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

    x = result.x;
    y = result.y;


    var iconPng = "img/" + arrowCircle.icon + ".png";

    var scaleFactor = 0.3;

    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point([x, y])

    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            scale: scaleFactor,
            src: iconPng
        }))
    });


    var highlightStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            scale: scaleFactor*1.33, //make it 33% bigger if clicked
            src: iconPng
        }))
    });


    iconFeature.setStyle(iconStyle);
    iconFeature.id = id;

    iconFeature.highlightStyle =  highlightStyle;
    iconFeature.unSelectedStyle = iconStyle;

    return iconFeature;

}















