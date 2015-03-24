/**
 * Created by lwi on 19.03.2015.
 */

function OLMap(config, mapService){
    this.layerGoogle = new OpenLayers.Layer.Google("google");
    this.layerOSM = new OpenLayers.Layer.OSM("OSM");
    this.activeLayer = this.layerOSM;
    this.config = config;

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
    this.olMap = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection("EPSG:4326"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        eventListeners: {
            nofeatureclick: function(e){
                if (selectedfeature != null){
                    setSelected(selectedfeature, false);
                    selectedfeature.layer.redraw();
                }
                //rightMenuClass.closeRightPanel();
                mapService.hideInformation();
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
                    //rightMenuClass.closeRightPanel();
                    mapService.hideInformation();
                    selectedfeature = null;
                }else{
                    if (selectedfeature != null){
                        setSelected(selectedfeature, false);
                    }
                    selectedfeature = e.feature;
                    setSelected(e.feature, true);
                    //rightMenuClass.openRightPanel();
                    var mapObject = this.olMap.getLayersByName(e.feature.layer.name)[0].getFeatureById(e.feature.id).mapObject;
                    mapService.showInformation(mapObject);
                    //rightMenuClass.fillRightMenu();
                }
                e.feature.layer.redraw();
            }
        }
    });

    this.olMap.addLayer(this.layerOSM);
    this.setCenter(this.config.default.city);
};

OLMap.prototype.setCenter = function(city) {
    if (this.olMap == null) return;
    if (this.config == null) return;

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

OLMap.prototype.addParkingLayer = function(streetlifeSocket){
    var newObserver = {
        notify : function(){
            var mo = streetlifeSocket.getLastRecievedMapObject();
            addObjects(mo);
        }
    };

    this.olMap.addLayer(getParkingLayer());
    streetlifeSocket.addObserver(newObserver);
};