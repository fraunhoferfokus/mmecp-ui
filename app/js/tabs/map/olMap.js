/**
 * Created by lwi on 05.03.2015.
 */

function OLMap(mapScope, config, rightMenuClass){
    scope = mapScope;

    scope.layerGoogle = new OpenLayers.Layer.Google("google");
    scope.layerOSM = new OpenLayers.Layer.OSM("OSM");
    scope.activeLayer = scope.layerOSM;

    var setCenter = function(city) {
        if (scope.olMap == null) return;
        if (config == null) return;

        var lon, lat, zoom;
        if (city == config.coordinate.ROV.name) {
            lon = config.coordinate.ROV.lon;
            lat = config.coordinate.ROV.lat;
            zoom = config.coordinate.ROV.zoom;
        }else if (city == config.coordinate.BER.name) {
            lon = config.coordinate.BER.lon;
            lat = config.coordinate.BER.lat;
            zoom = config.coordinate.ROV.zoom;
        }else if (city == config.coordinate.TAM.name) {
            lon = config.coordinate.TAM.lon;
            lat = config.coordinate.TAM.lat;
            zoom = config.coordinate.ROV.zoom;
        }

        scope.olMap.setCenter(new OpenLayers.LonLat(lon,lat) // Center of the map
                .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
            ), zoom // Zoom level
        );
    };

    var setSelected = function(feature, select){
        if (feature == null) return;

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

    var selectedfeature;
    scope.olMap = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection("EPSG:4326"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        eventListeners: {
            nofeatureclick: function(e){
                if (selectedfeature != null){
                    setSelected(selectedfeature, false);
                    selectedfeature.layer.redraw();
                }
                rightMenuClass.closeRightPanel();
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
                    rightMenuClass.closeRightPanel();
                    selectedfeature = null;
                }else{
                    if (selectedfeature != null){
                        setSelected(selectedfeature, false);
                    }
                    selectedfeature = e.feature;
                    setSelected(e.feature, true);
                    rightMenuClass.openRightPanel();
                    rightMenuClass.fillRightMenu(scope.olMap.getLayersByName(e.feature.layer.name)[0].getFeatureById(e.feature.id).mapObject);
                }
                e.feature.layer.redraw();
            }
        }
    });

    scope.olMap.addLayer(scope.layerOSM);
    setCenter(config.default.city);
};

OLMap.prototype.addParkingLayer = function(streetlifeSocket){
    var newObserver = {
        notify : function(){
            var mo = streetlifeSocket.getLastRecievedMapObject();
            addObjects(mo);
        }
    };

    scope.olMap.addLayer(getParkingLayer());
    streetlifeSocket.addObserver(newObserver);
};