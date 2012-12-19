

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
        markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
        i += 7 * 24 * 60 * 60 * 1000;
    } while (i < axes.xaxis.max);

    return markings;
}

// plot daily data given chartDiv, selectorDiv and some formatted data
function plotDailies(chartDivID, selectorDivID, data) {
    var options = {
        xaxis: { mode: "time", tickLength: 5 },
        selection: { mode: "x" },
        grid: { markings: weekendAreas }
    };
    
    var plot = $.plot($("#"+chartDivID), [data], options);
    
    var overview = $.plot($("#"+selectorDivID), [data], {
        series: {
            lines: { show: true, lineWidth: 1 },
            shadowSize: 0
        },
        xaxis: { ticks: [], mode: "time" },
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
}
