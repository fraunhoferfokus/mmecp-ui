/**
 * Created by Aminskee on 10.03.15.
 */
angular.module('app.config',[

])

    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('/', {
                url: "/",
                templateUrl: "modules/dashboard/partials/dashboard.html",
                controller:'dashboardController'
            });

    }).factory('configService', function(){
        var config;
        $.ajaxSetup({
            async: false
        });
        $.getJSON( "config/map.json", function(data) {
            config = data;
        }).fail(function(data) {
            console.log( "error: " + data.status);
        });
        $.ajaxSetup({
            async: true
        });

        return config;
    });