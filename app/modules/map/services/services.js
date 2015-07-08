/**
 * Created by lwi on 11.05.2015.
 */

angular.module('app.dashboard.map.services', ['app.socket', 'app.config', 'app.dashboard.map.directives', 'nvd3ChartDirectives'])

.service('mapService', function(socketService){
    this.send = function(requestString){
        socketService.send(requestString);
    };
    this.mapObjectForInformationPanel = undefined;
});