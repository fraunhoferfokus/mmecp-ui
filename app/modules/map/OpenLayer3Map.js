/**
 * Created by lwi on 19.03.2015.
 */

function OpenLayer3Map(config, rootboadcastEvent, mapService){







    var feature = new ol.Feature({
       geometry: new ol.geom.Polygon([[[11.033717556725508,45.88931544565038],[11.033700302151367,45.88933143170906],[11.033627267150878,45.889376438324135],[11.033615127432812,45.889376834429946],[11.033600647101757,45.889369603757586],[11.033598941674041,45.889363135741355],[11.033657530847403,45.8893210234473],[11.033655999118114,45.889312473560516],[11.033647235877954,45.88926355839159],[11.033587547093187,45.88930661730763],[11.03358123673667,45.88930886387999],[11.033561680256534,45.88931582624807],[11.033550705273157,45.8893152925623],[11.033515317634828,45.88931013512677],[11.033501119849959,45.88930499561801],[11.03347216275377,45.8892945133229],[11.033468098736426,45.889272156369685],[11.033450627288742,45.8892737274214],[11.033407765812095,45.889278855564726],[11.033401200343771,45.889286838874675],[11.033382033534613,45.88928996768699],[11.033383869018813,45.889299334325415],[11.033589402953112,45.89037867977304],[11.03379429863476,45.89035912953168],[11.033810801753473,45.89036209392568],[11.033907799134488,45.8903401409583],[11.033897273776002,45.89031511988216],[11.033889891079298,45.89029522951364],[11.033875891941616,45.89025748666589],[11.03386637347071,45.89022715468659],[11.033856337234903,45.89019094300711],[11.033846689058354,45.890148466585025],[11.033842021413069,45.89012702968189],[11.033815296242578,45.890006679585234],[11.033823138627843,45.89000098058764],[11.033829494848298,45.88999397303531],[11.033829646932677,45.88998225165491],[11.03380742450093,45.88985015965884],[11.033768488919552,45.8896168393497],[11.033717556725508,45.88931544565038]]])

    });


    var polyStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'blue'
        }),
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        })
    });


    feature.setStyle(polyStyle);



    feature.getGeometry().transform('EPSG:4326', 'EPSG:900913');
    this.vectorOfMapObjects= new ol.source.Vector({
        features: [feature ]
    });


    var vectorLayer = new ol.layer.Vector({
        source:  this.vectorOfMapObjects
    });




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
      /*  fill: new ol.style.Fill({
            color: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + 0.9 + ")"
        }),*/
        stroke: new ol.style.Stroke({
            color: "rgba(255,0,0,1)",
            width: 3
        })

    });




    this.map.on('singleclick', function(evt) {
        var feature = this.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {

                if(feature.highlightStyle !== undefined)
                {
                    feature.setStyle(feature.highlightStyle);
                }
                else
                {
                    feature.setStyle(defaultHighlightStyle);
                }

                console.log(feature);
                return [feature, layer];
            });
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
                feature = this.createPolygonFeature(mapArea, fid);
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


    console.log("addMapObjectsToMap................");

    var feature = this.generateMapObjectFeature(mapObjectTyp,mapObjectElement,fid);

    feature.mapObject = mapObjectElement;

    //TODO remove old mapobject with same fid if existing
   /* var existingMapObject = this.vectorOfMapObjects.getFeatureBy('fid', fid);
    if(existingMapObject)
    {
        this.vectorOfMapObjects.removeFeatures(existingMapObject);
    } */


    this.vectorOfMapObjects.addFeatures([feature]);


};



OpenLayer3Map.prototype.addObjects = function (mapObjectList){

    console.log("start drawing map objects");

    for (i = 0;i<mapObjectList.length; i++){

        console.log(".......x");
        mapObjectList[i] = this.prepareMapData(mapObjectList[i]);
        this.addMapObjectToMap(mapObjectList[i]);




    }

};


OpenLayer3Map.prototype.createPolygonFeature = function(area, id){


    console.log("DRAW Polygon!.....................");

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





    feature.setStyle(polyStyle);



    feature.getGeometry().transform('EPSG:4326', 'EPSG:900913');
    return feature;


   /* var pointList = [],
        polygonGeometry,
        polygonFeature,
        vector = new ol.Layer.Vector('polygonLayerVector');

    var coords = area.area.coordinates[0];
    for (var i=0; i<coords.length; i++) {

        var point = new ol.Geometry.Point(coords[i][0], coords[i][1]);
        pointList.push(point);
    }

    var linearRing = new ol.Geometry.LinearRing(pointList).transform(
        new ol.Projection("EPSG:4326"),
        new ol.Projection("EPSG:900913"));



    var polygon = new ol.Geometry.Polygon([linearRing]);
    //console.log(polygon);
    var newVector = this.addPolygon(area,polygon,id);

    return newVector;



    */

};

OpenLayer3Map.prototype.addPolygon = function(area,polygon, id){


    var style=  {
        fillColor: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
        strokeColor: "rgba(" + area.color.red + ", " + area.color.green + ", " + area.color.blue + ", " + area.color.alpha + ")",
        strokeWidth: 1
    };

    var newVector = new ol.Feature.Vector(polygon, null, style);

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
            strokeWidth: 2,
        },
        strokeWidth: 1
    };

    return newVector;
};



OpenLayer3Map.prototype.createPolygonFromUTMFeature = function(area, id){


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


OpenLayer3Map.prototype.createArrowCircleFeature = function(arrowCircle, id){


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
