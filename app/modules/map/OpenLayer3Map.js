/**
 * Created by lwi on 19.03.2015.
 */

function OpenLayer3Map(config, rootboadcastEvent, mapService){


    this.config = config;
    this.mapService = mapService;

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

