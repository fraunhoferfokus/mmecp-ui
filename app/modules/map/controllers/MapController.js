/**
 * Created by lwi on 19.03.2015.
 */

angular.module('app.dashboard.map', ['app.socket', 'app.config'])

    .service('mapService', function(){
        this.mapObjects = [];

    })

    .controller('mapController', ['$scope', 'mapService', 'configService', function($scope, mapService, configService){
        var map = new OLMap(configService, mapService);

        //Events:
        //addLayer, removeLayer, switchLayer
        //******************
        $scope.$on('addLayer', function(event, args){
            addLayer(args);
        });
        $scope.$on('removeLayer', function(event, args){
            addLayer(args);
        });
        $scope.$on('switchLayer', function(event, args){
            switchLayer(args);
        });
        $scope.$on('updateMap', function(event, args){
            updateMap();
        });

        var updateMap = function(){
            map.olMap.updateSize();
        };
        var addLayer = function(newLayer){
            //add new Layer
            //usually called from filter Panel
        };
        var removeLayer = function(layer){
            //add new Layer
            //usually called from filter Panel
        };
        var switchLayer = function(){
            //toggle the OpenStreet and Google Layer
            //usually called from filter Panel
        };
        //******************

    }])

    .controller('filterController', ['$scope', 'mapService', function($scope, mapService){
        //new LeftMenu();
    }])

    .controller('informationController', ['$scope', 'mapService', function($scope, mapService){
        //Events:
        //openInformationPanel, closeInformationPanel
        //******************
        $scope.$on('openInformationPanel', function(event, args){
            openInformationPanel(args);
        });

        $scope.$on('closeInformationPanel', function(event, args){
            closeInformationPanel();
        });

        var openInformationPanel = function(){
            //Show the information Panel with information out of the mapObject
            //usually called from map Panel
        };
        var closeInformationPanel = function(){
            //hide the information Panel
            //usually called from map Panel
        };
        //******************


        //new RightMenu();


    }])

    .directive('olMap', function(){
        return {
            restrict: 'E',
            template: ' <div style="width:100%; height:100%" id="map"></div> ',
            controller: 'mapController'
        }
    });