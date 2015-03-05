/**
 * Created by lwi on 04.03.2015.
 */

$(window).resize(function(){
    var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
    $('.contentHight').css('height', height);
});

var showNotification = function(text){
    $('.top-right').notify({
        message: {text: text},
        type: "info",
        fadeOut: {
            delay: 5000
        }
    }).show();
};

var makeNotificationReady = function(){

        window.prettyPrint && prettyPrint()
        $('.show-notification').click(function (e) {
            $('.top-right').notify({
                message: {text: "Notification-Example"},
                type: "info",
                fadeOut: {
                    delay: 5000
                }
            }).show();
        });

        /* Custom Styles */
        var custom = [
            'bangTidy',
            'blackgloss'
        ];

        for (var i = 0; i < custom.length; i++) {
            var type = custom[i];

            (function (type) {
                $('.show-' + type).click(function (e) {
                    var message = "Notification-Example";
                    $('.' + message[0]).notify({message: {text: message[2]}, type: type}).show();
                });
            })(type);
        }
};

$( document ).ready(function() {
    var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
    $('.contentHight').css('height', height);
    $('#tabs a[href="#Impressum"]').hide();

    makeNotificationReady();
});

var closeImpressum = function(){
    $('#tabs a[href="#mapPanel"]').tab('show');
    $('#tabs a[href="#Impressum"]').hide();
    var height = ($( window  ).height() - $("#tabs").height() - $("#header").height()) + "px";
    $('.contentHight').css('height', height);
};