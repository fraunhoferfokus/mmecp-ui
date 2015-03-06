/**
 * Created by lwi on 03.03.2015.
 */


var createChart = function(chartElement){
    var chart = chartElement;

    if (chart == null) return null;

    var labeldescription = chart.labeldescription;
    var valuedescription = chart.valuedescription;
    var data = chart.data;

    var retType = {
        "type": "ColumnChart",
        "displayed": true,
        "data": {
            "cols": [],
            "rows": []
        },
        "options": {
            "title": labeldescription,
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": valuedescription,
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": ""
            }
        },
        "formatters": {}
    };

    retType.data.cols = [
        {id: "t", label: "", type: "string"},
        {
            id: "t",
            label: "",
            type: "number"
        }];
    retType.data.rows = [];
    for (j = 0;j<data.length;j++){
        retType.data.rows.push(
            {
                c: [
                    {v: data[j].label},
                    {v: data[j].value},
                ]
            }
        );
    }
    return retType;
};