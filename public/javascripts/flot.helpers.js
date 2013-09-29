

// helper for returning the weekends in a period
function weekendAreas(axes) {
    var markings = [];
    var d = new Date(axes.xaxis.min);
    // go to the first Saturday
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
    d.setUTCSeconds(0);
    d.setUTCMinutes(0);
    d.setUTCHours(0);
    var i = d.getTime();
    do {
        // when we don't set yaxis, the rectangle automatically
        // extends to infinity upwards and downwards
        markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 }, color: '#FFF' });
        i += 7 * 24 * 60 * 60 * 1000;
    } while (i < axes.xaxis.max);

    return markings;
}



// plot daily data given chartDiv, selectorDiv and some formatted data
function plotDailies(chartDivID, selectorDivID, data) {
    if (data !== undefined) {
    var options = {
        xaxis: { mode: "time", tickLength: 5 },
        yaxes: [ { min: 0 }],
        selection: { mode: "x" },
        grid: { 
            markings: weekendAreas,
            hoverable: true //IMPORTANT! this is needed for tooltip to work
        },
        series: {
            lines: { 
                show: true, 
                lineWidth: 1 
            },
            points: { 
                show: true,
                radius: 1
            }
        },
        tooltip: true,
        tooltipOpts: {
            content: "<strong>%y</strong>, %x"
        }
    };
    

    var plot = $.plot($("#"+chartDivID), [data], options);
    
    var overview = $.plot($("#"+selectorDivID), [data], {
        series: {
            lines: { show: true, lineWidth: 1 },
            shadowSize: 0
        },
        xaxis: { ticks: [], mode: "time", font: { family:"Helvetica",color:"#FFF"} },
        yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1 },
        selection: { mode: "x" }
    });

    // now connect the two
    
    $("#"+chartDivID).bind("plotselected", function (event, ranges) {
        // do the zooming
        plot = $.plot($("#"+chartDivID), [data],
                      $.extend(true, {}, options, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                      }));

        // don't fire event on the overview to prevent eternal loop
        overview.setSelection(ranges, true);
    });
    
    $("#"+selectorDivID).bind("plotselected", function (event, ranges) {
        plot.setSelection(ranges);
    });
    } else {
        console.log("No data for "+chartDivID);
    }
};

// plot 2 sets of dailies data given chartDiv, selectorDiv and two formatted data series 
function plot2Dailies(chartDivID, selectorDivID, data1, data2) {
    var options = {
        xaxis: { mode: "time", tickLength: 5 },
        selection: { mode: "x" },
        grid: { 
            markings: weekendAreas,
            hoverable:true
        }, 
        legend: {             
            backgroundColor: "#FFFFFF", // null means auto-detect
            backgroundOpacity: 0 // set to 0 to avoid background}
        },
        series: {
            lines: { 
                show: true, 
                lineWidth: 1 
            },
            points: { 
                show: true,
                radius: 1
            }
        },
        tooltip: true,
        tooltipOpts: {
            content: "<strong>%y</strong>, %x"
        }
    };
    
    var plot = $.plot($("#"+chartDivID), [data1, data2], options);
    
    var overview = $.plot($("#"+selectorDivID), [data1, data2], {
        series: {
            lines: { show: true, lineWidth: 1 },
            shadowSize: 0
        },
        legend: {
            show: false
        },
        xaxis: { ticks: [], mode: "time", font: { family:"Helvetica",color:"#FFF"} },
        yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1 },
        selection: { mode: "x" }
    });

    // now connect the two
    
    $("#"+chartDivID).bind("plotselected", function (event, ranges) {
        // do the zooming
        plot = $.plot($("#"+chartDivID), [data1, data2],
                      $.extend(true, {}, options, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                      }));

        // don't fire event on the overview to prevent eternal loop
        overview.setSelection(ranges, true);
    });
    
    $("#"+selectorDivID).bind("plotselected", function (event, ranges) {
        plot.setSelection(ranges);
    });
    
};
