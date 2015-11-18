/**
 * Created by lwi on 19.03.2015.
 */

function OpenLayer3Map(config, rootbroadcastEvent, mapService){


    this.mapService = mapService;

    //we need to know some other coordinate systems
    proj4.defs('EPSG:32633', "+title= WGS 84 +proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
    proj4.defs('EPSG:2393',"+title= KKJ +proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs");

    this.vectorOfMapObjects= new ol.source.Vector({
        features: [ ]
    });


    var vectorLayer = new ol.layer.Vector({
        source:  this.vectorOfMapObjects
    });


    var selectedFeature;

    this.config = config;


    this.vectorOfHeatMapObjects= new ol.source.Vector({
        features: [ ]
    });

     this.heatmapLayer = new ol.layer.Heatmap({
        source: this.vectorOfHeatMapObjects}

     );
       // blur: parseInt(blur.value, 10),
       // radius: parseInt(radius.value, 10)


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
    this.map.addLayer(this.heatmapLayer);



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
                    if(selectedFeature.parentLayer !== 'heatmap')
                    selectedFeature.setStyle(selectedFeature.unSelectedStyle);
                }

                selectedFeature = feature;

                if(feature.highlightStyle !== undefined)
                {
                    if(selectedFeature.parentLayer !== 'heatmap')
                    feature.setStyle(feature.highlightStyle);

                }
                else
                {
                    if(selectedFeature.parentLayer !== 'heatmap')
                    feature.setStyle(defaultHighlightStyle);
                }



                mapService.mapObjectForInformationPanel = feature.mapObject;
                rootbroadcastEvent('openMapObjectInformationPanel',null);
                rootbroadcastEvent('updateMapObject');
                rootbroadcastEvent('closeBigMap');


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



}

OpenLayer3Map.prototype.setCenter = function(city) {
    if (this.olMap === null) return;
    if (this.config === null) return;

    var lon, lat, zoom;
    lat = this.mapService.citiesDefaults.mapView[city].center.lat;
    lon = this.mapService.citiesDefaults.mapView[city].center.lon;
    zoom = this.mapService.citiesDefaults.mapView[city].zoom;
    console.log("OpenLayers Action: change center");
    console.log("Long: " + lon + " Lat: " + lat);
    this.map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:900913'));
    this.map.getView().setZoom(zoom);


};

OpenLayer3Map.prototype.getmapAreasofMapObject = function(mapObject){
    var mapArrayList = [];
    var amountOfMapAreas = 0;
    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea !== undefined){
            mapArrayList.push(mapObject.elements[i].maparea);
            amountOfMapAreas++;
        }
        if (mapObject.elements[i].MapArea !== undefined){
            mapArrayList.push(mapObject.elements[i].MapArea);
            amountOfMapAreas++;
        }
    }
    console.log("AmountOfMapAreas: "+amountOfMapAreas);
    return mapArrayList;
};



OpenLayer3Map.prototype.getHeatMapWeight = function(mapObject){
    var weight = 0;
    for (var i = 0;i<mapObject.elements.length;i++){
        if(mapObject.elements[i].attribute !== undefined)
        {

            if(mapObject.elements[i].attribute.label == "traffic_rate")
            {
                weight = mapObject.elements[i].attribute.value;
            }
        }
    }
    return weight;
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


        //lowercase attribute



    }

    return mapObject;
};


OpenLayer3Map.prototype.generateMapObjectFeatures = function (mapObjectTyp,mapObjectElement,fid){

    var feature;

    console.log("---------------------------------------");
    console.log(mapObjectTyp);
    var featureList = [];
    switch(mapObjectTyp)
    {
        case "arrowedCircle":
        {
            //console.log("draw arrowCircle " + i);
            var arrowCircle =  this.getCircleArrowOfMapObject(mapObjectElement);
            feature = this.createArrowCircleFeature(arrowCircle, fid);
            featureList.push(feature);
            break;
        }
        case "mapArea":
        {


            var mapAreaList = this.getmapAreasofMapObject(mapObjectElement);

            for(var i  = 0;i<mapAreaList.length;i++)
            {
                var mapArea = mapAreaList[i];
                var weight = this.getHeatMapWeight(mapObjectElement);
                mapArea.weight = weight;
                feature = this.createMapFeature(mapArea, fid);
                featureList.push(feature);

            }


            break;
        }

    }
    return featureList;

};


OpenLayer3Map.prototype.addMapObjectToMap = function (mapObjectElement){

    var mapObjectTyp = this.getMapObjectTyp(mapObjectElement);
    var fid = mapObjectElement.objectID + ":" +
        mapObjectElement.objectType + ":" +
        mapObjectElement.objectSubtype;

    var featureList = this.generateMapObjectFeatures(mapObjectTyp,mapObjectElement,fid);
    var feature;

    //add features to correct layer
    for(var i = 0;i<featureList.length;i++) {

        feature = featureList[i];


        feature.mapObject = mapObjectElement;
        this.removeFeatureIfExisting(fid);
        if (feature.parentLayer == 'mapObjects' || feature.parentLayer === undefined) {
            this.vectorOfMapObjects.addFeatures([feature]);
        
        }
        if (feature.parentLayer == 'heatmap') {
            this.vectorOfHeatMapObjects.addFeature(feature);
        }
    }

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
};


OpenLayer3Map.prototype.removeAllFeatures = function()
{
    this.vectorOfMapObjects.clear();
};


OpenLayer3Map.prototype.removeHeatMapFeatures = function()
{
    this.vectorOfHeatMapObjects.clear();
};



OpenLayer3Map.prototype.removeFeaturesWithSubType = function(subType)
{
    //search feature in mapObjects
    var features = this.vectorOfMapObjects.getFeatures();
    var feature;
    for(var i = 0;i<features.length;i++)
    {
         feature = features[i];
        if(feature.mapObject.objectSubtype == subType)
        {
            this.vectorOfMapObjects.removeFeature(feature);
        }
    }

    //search feature in heatmap
     features = this.vectorOfHeatMapObjects.getFeatures();
    for(i = 0;i<features.length;i++)
    {
         feature = features[i];
       // console.log(feature.mapObject.objectSubtype);
        console.log(subType);
        if(feature.mapObject.objectSubtype == subType)
        {
            this.vectorOfHeatMapObjects.removeFeature(feature);
        }
    }
};


OpenLayer3Map.prototype.addObjects = function (mapObjectList){

    console.log("start drawing map objects");
    console.log(mapObjectList);

    for (var i = 0;i<mapObjectList.length; i++){
        mapObjectList[i] = this.prepareMapData(mapObjectList[i]);
        this.addMapObjectToMap(mapObjectList[i]);
    }

};


OpenLayer3Map.prototype.createHeatmapFeature = function(area, id){

    var coords = area.area.coordinates;
    var feature;

    if(area.area.coordinateType === "UTM")
    {

            var point = [coords[0].e, coords[0].n];
             coords = [point[0],point[1]];
    }

    feature = new ol.Feature({
        geometry: new ol.geom.Point(coords)
    });
    feature.parentLayer = "heatmap";
    var maxWeight = this.config.heatmap.maxWeight;

    feature.set('weight',area.weight/maxWeight);
    return feature;

};



OpenLayer3Map.prototype.createPolygonFeature = function(area, id){


    var coords;
    var feature;

    coords = area.area.coordinates[0];
    var pointList = [];
    if(area.area.coordinateType === "UTM")
    {
        for (var i=0; i<coords.length; i++) {
            var point = [coords[i].e, coords[i].n];
            pointList.push([point[0],point[1]]);
        }
        coords = pointList;
    }

    feature = new ol.Feature({
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
    feature.parentLayer = "mapObjects";
    return feature;



};





OpenLayer3Map.prototype.createMapFeature = function(area, id){
    var coords;
    var sourceCoordSystem = "EPSG:4326";


    var type =  area.area.type;
    var feature;

    if(type === "heatmap")
    {

    feature = this.createHeatmapFeature(area,id);

    }
    if(type.toLowerCase() === "polygon")
    {
       feature =  this.createPolygonFeature(area,id);

    }



    //TRANSFORM COORDINATES
    if(area.area.coordinateType === "UTM")
    {
        sourceCoordSystem = "EPSG:32633";
    }

    if(sourceCoordSystem !== undefined)
    {
        feature.getGeometry().transform(sourceCoordSystem, 'EPSG:900913');
    }
    feature.id = id;

    return feature;



};



OpenLayer3Map.prototype.getMapObjectTyp = function (mapObject)
{

    if(mapObject.elements === undefined)
        return "unkown";

    for (var i = 0;i<mapObject.elements.length;i++){
        if (mapObject.elements[i].maparea !== undefined || mapObject.elements[i].MapArea !== undefined){
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


    var point = [x, y];
    point = proj4('EPSG:2393','EPSG:900913',point);


    x = point[0];
    y = point[1];


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

};















