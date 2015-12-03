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
    var selectedLayer;

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




    var setOnlySelectedFeatureMode = function(mode)
    {
        mapService.showOnlySelectedFeatureMode = mode;
    };




    var highlightAllFeaturesOfAGroup = function(groupID,featureList) {

        for(var i = 0;i<featureList.length;i++)
        {

            if(featureList[i].groupID == groupID)
            {
                featureList[i].setStyle( featureList[i].highlightStyle);
                // featureList[i].setZIndex(10);

            }
            else
            {
                if(featureList[i].nearlyInvisibleStyle !== undefined) {
                    featureList[i].setStyle(featureList[i].nearlyInvisibleStyle);
                }

            }
        }
        setOnlySelectedFeatureMode(true);

    };



    var setNormalStyleOfAllFeaturesOfAGroup =  function(groupID,featureList) {


        for(var i = 0;i<featureList.length;i++)
        {
                featureList[i].setStyle( featureList[i].unSelectedStyle);
        }
        setOnlySelectedFeatureMode(false);

    };


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
                selectedLayer = layer;

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


                if(feature.groupID !== undefined)
                {

                    var featureList = layer.getSource().getFeatures();
                    highlightAllFeaturesOfAGroup(feature.groupID,featureList);
                }

                mapService.mapObjectForInformationPanel = feature.mapObject;
                rootbroadcastEvent('openMapObjectInformationPanel',null);
                rootbroadcastEvent('updateMapObject');
                rootbroadcastEvent('closeBigMap');


                return [feature, layer];
            });

        if(feature === undefined)  //user clicked on position the map where no features were placed
        {
            //no feature selected, close detail view
            rootbroadcastEvent('closeMapObjectInformationPanel', null);

            //unselect previous selected feature
            if(selectedFeature.groupID !== undefined)
            {
                var featureList = selectedLayer.getSource().getFeatures();
                setNormalStyleOfAllFeaturesOfAGroup(selectedFeature.groupID,featureList);
            }
            else
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
    //console.log("AmountOfMapAreas: "+amountOfMapAreas);
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
               var features = this.createMapFeature(mapArea, fid);

               featureList = featureList.concat(features);


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
            this.vectorOfMapObjects.addFeature(feature);


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
        if(feature.id === fid)
        {
            this.vectorOfMapObjects.removeFeature(feature);
            console.log("remove");
        }
    }

    features = this.vectorOfHeatMapObjects.getFeatures();
    for(i = 0;i<features.length;i++)
    {
        feature = features[i];

        if(feature.id === fid)
        {
            this.vectorOfHeatMapObjects.removeFeature(feature);
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

OpenLayer3Map.prototype.createLineFeature = function(area, id){


    var coords;
    var feature;

    console.log("make a line");
    coords = area.area.coordinates;
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
        geometry: new ol.geom.LineString(coords)
    });

    var polyStyle = new ol.style.Style({

        stroke: new ol.style.Stroke({
            color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + 0.5 + ")",

            width: 5,

        }),
        zIndex: 5
    });

    var highlightStyle = new ol.style.Style({

        stroke: new ol.style.Stroke({
            color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + 1 + ")",
            width: 8

        }),
        zIndex: 10

    });

    var nearlyInvisibleStyle = new ol.style.Style({

        stroke: new ol.style.Stroke({
           // color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + 0.1 + ")",
            color:  "rgba(144, 163, 169, 0.8)",
            width: 5

        }),
        zIndex:5
    });



    feature.highlightStyle =  highlightStyle;
    feature.unSelectedStyle = polyStyle;
    feature.nearlyInvisibleStyle = nearlyInvisibleStyle;

    if(this.mapService.showOnlySelectedFeatureMode === false)
    {
        feature.setStyle(polyStyle);

    }
    else{
        feature.setStyle(nearlyInvisibleStyle);
    }


    feature.parentLayer = "mapObjects";
    if(area.groupID !== undefined)
    {
        feature.groupID = area.groupID;
    }
    return feature;



};


OpenLayer3Map.prototype.createLineFeatureWithStartAndEndPoints = function(area, id){


    var coords;
    var lineFeature;

    console.log("make a line");
    coords = area.area.coordinates;
    var pointList = [];
    if(area.area.coordinateType === "UTM")
    {
        for (var i=0; i<coords.length; i++) {
            var point = [coords[i].e, coords[i].n];
            pointList.push([point[0],point[1]]);
        }
        coords = pointList;
    }


    var startPoint = coords[0];
    var endPoint = coords[coords.length-1];



    lineFeature = new ol.Feature({
        geometry: new ol.geom.LineString(coords)
    });

    var polyStyle = new ol.style.Style({


        stroke: new ol.style.Stroke({
            color: "rgba(" + 0 + ", " + 140 + ", " + 186 + ", " + 0.5 + ")",
            width: 5
        })
    });

    var highlightStyle = new ol.style.Style({


        stroke: new ol.style.Stroke({
            color: "rgba(" + 0 + ", " +  140 + ", " + 186 + ", " + 1 + ")",
            width: 10
        }),
    });

    lineFeature.highlightStyle =  highlightStyle;
    lineFeature.unSelectedStyle = polyStyle;

    lineFeature.setStyle(polyStyle);
    lineFeature.parentLayer = "mapObjects";
    lineFeature.id = id+"line";


    var startIconFeature = this.createIcon(startPoint,id+"start_icon","A",[0.5,0.5],0.6);
    var endIconFeature = this.createIcon(endPoint,id+"end_icon","B",[0.5,0.5],0.6);

    startIconFeature.parentLayer  = "mapObjects";
    endIconFeature.parentLayer = "mapObjects";


    var features = [];
    features.push(lineFeature);
    features.push(endIconFeature);
    features.push(startIconFeature);

    return features;



};

OpenLayer3Map.prototype.createMapFeature = function(area, id){
    var coords;
    var sourceCoordSystem = "EPSG:4326";

    var featureList = [];
    var type =  area.area.type;
    var feature;

    if(type === "heatmap")
    {

    feature = this.createHeatmapFeature(area,id);
        feature.id = id;
        featureList.push(feature);

    }
    if(type.toLowerCase() === "polygon")
    {

       feature =  this.createPolygonFeature(area,id);
        feature.id = id;
        featureList.push(feature);

    }
    if(type.toLowerCase() === "line")
    {
        console.log("LINE");
      // featureList = this.createLineFeatureWithStartAndEndPoints(area,id);
        feature = this.createLineFeature(area,id);
        feature.id = id+"#line";

        featureList.push(feature);

    }
    if(type.toLowerCase() === "icon")
    {
        console.log("yay icon");

        //console.log(area.coordinates);
        console.log(area);
        feature = this.createIcon(area.area.coordinates,id+"#"+area.area.icon,area.area.icon,area.area.anchor,area.area.scale);
        if(area.groupID !== undefined)
        {
            feature.groupID = area.groupID;
        }

        featureList.push(feature);



    }



    featureList = this.transformCoordinates(sourceCoordSystem,'EPSG:900913',featureList,area.area.coordinateType);



    return featureList;



};

OpenLayer3Map.prototype.transformCoordinates = function(sourceSystem,destinationSystem,listOfFeatures,coordinateType)
{

    var feature;
    for(var i =0;i<listOfFeatures.length;i++)
    {
        feature = listOfFeatures[i];
        //TRANSFORM COORDINATES
        if(coordinateType === "UTM")
        {
            sourceSystem = "EPSG:32633";
        }

        if(sourceSystem !== undefined)
        {
            feature.getGeometry().transform(sourceSystem, destinationSystem);
        }

        listOfFeatures[i] = feature;

    }

    return listOfFeatures;


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



OpenLayer3Map.prototype.createIcon= function(coords, id,icon,anchor,scale) {


    console.log("Draw icons");

    var x = coords[0];
    var y = coords[1];

    var iconPng = "img/" + icon + ".png";
    var iconGray =  "img/" + icon + "_gray.png";

    var scaleFactor = scale;

    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point([x, y])

    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: anchor,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            scale: scaleFactor,
            src: iconPng
        })),
        zIndex:5
    });


    var highlightStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: anchor,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            scale: scaleFactor*1.33, //make it 33% bigger if clicked
            src: iconPng
        })),
        zIndex:10
    });


    var nearlyInvisibleStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: anchor,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.3,
            scale: scaleFactor, //make it 33% bigger if clicked
            src: iconGray
        })),
        zIndex:5
    });


    if(this.mapService.showOnlySelectedFeatureMode === false)
    {
        iconFeature.setStyle(iconStyle);
    }
    else{
        iconFeature.setStyle(nearlyInvisibleStyle);
    }

    iconFeature.id = id;

    iconFeature.highlightStyle =  highlightStyle;
    iconFeature.unSelectedStyle = iconStyle;
    iconFeature.nearlyInvisibleStyle = nearlyInvisibleStyle;

    return iconFeature;

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
            anchor: [0.5, 200],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            scale: scaleFactor,
            src: iconPng
        }))
    });


    var highlightStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 200],
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















