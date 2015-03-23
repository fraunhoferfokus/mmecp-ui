/**
 * Created by Aminskee on 10.03.15.
 */
var streetlifeDependencies=[
    'ngRoute',
    'ui.router',
    'ngAnimate',
    'mm.foundation',
    'app.config',
    'app.dashboard'
]

var app = angular.module('app', streetlifeDependencies)
    .run ( function ( $rootScope, $log ) {
    $log.log ("run app")
});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});