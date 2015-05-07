/**
 * Created by Aminskee on 10.03.15.
 */
var streetlifeDependencies=[
    'ngRoute',
    'ui.router',
    'ngAnimate',
    'mm.foundation',
    'ngWebsocket',
    'app.config',
    'app.dashboard',
    'app.dashboard.controllers',
    'app.dashboard.map',
    'app.dashboard.statusPanel',
    'app.dashboard.directives',
    'app.socket',
    'app.config',
    'nvd3ChartDirectives'
];

var app = angular.module('app', streetlifeDependencies)
    .run ( function ( $rootScope, $log ) {
    $log.log ("run app");
});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});