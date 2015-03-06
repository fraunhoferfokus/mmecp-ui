/**
 * Created by lwi on 05.03.2015.
 */


function RightMenu(scope, runInApply){
    rightMenuScope = scope;
    this.runInApply = runInApply;

    //initial
    rightMenuScope.fadeoutright = false;
};

RightMenu.prototype.fillRightMenu = function(mapObject) {
    this.runInApply(function () {
        rightMenuScope.rightMenuElements = [];
        for (i = 0; i < mapObject.elements.length; i++) {

            if (mapObject.elements[i].attribute) {
                rightMenuScope.rightMenuElements.push(mapObject.elements[i].attribute);
            }
        }

        for (i = 0;i<mapObject.elements.length;i++){
            {
                if (mapObject.elements[i].chart) {
                    rightMenuScope.chartObject = createChart(mapObject.elements[i].chart);
                }
            }
        }
    });
};

RightMenu.prototype.openRightPanel = function(){
    this.runInApply(function () {
        rightMenuScope.fadeoutright = true;
        $('#rightMenuContent').css('display', 'inline');
    });
};

RightMenu.prototype.closeRightPanel = function(){
    this.runInApply(function () {
        rightMenuScope.fadeoutright = false;
        $('#rightMenuContent').css('display', 'none');
    });
};