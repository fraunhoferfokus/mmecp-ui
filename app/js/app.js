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
    'app.dashboard.map',
    'app.socket',
    'app.config',
    'nvd3ChartDirectives',
    'nvd3',
    'ngMessages',
    'daterangepicker'

];

var app = angular.module('app', streetlifeDependencies)
    .run ( function ( $rootScope, $log ) {
    $log.log ("run app");

});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
    $(document).foundation();
});

