/*globals document, window,  */

import "snapsvg";
import "snap.svg.zpd";

import defaultSettings from "./default-settings.js";
import defaultTestBikes from "./default-input-bikes.js";
import Bike from "./parse-geometry.js";

// TODO: Refactor draw function out of Bike() into a new module. Then...
// TODO: import Draw from "./draw-bike.js"

export default drawBikeComparison;

function drawBikeComparison(bike_geometries, settings) {
    "use strict";

    var drawSettings = defaultSettings;
    // TODO: Extend drawSettings with settings

    // TODO: Rename 'inputs' as unclear - these are the input geometries
    // TodO: Possibly refactor inputs to be a separate object outside of drawSettings.
    drawSettings['inputs'] = bike_geometries || defaultTestBikes;

    var bikecanvas = "#visual_bike",
        bikes = [],
        paper = Snap.select(bikecanvas),
        bounds = {
            x_min: 0,
            x_max: 0,
            y_min: 0,
            y_max: 0,
        },
        start_zoom,
        bbox;



    function drawNames(bikes, paper, start_x, start_y) {
        var height = 20,
            x = start_x,
            y = start_y - 2 * height,
            names = [];

        for (var i = 0; i < bikes.length; i ++) {
            names.push(paper.text(x, y, bikes[i].i.title ).attr({'fill': drawSettings['colours'][i % drawSettings['colours'].length]}))
            y -= height;
        }

    }

    for (let i = 0; i < drawSettings['inputs'].length; i++) {
        var bike = new Bike(drawSettings['inputs'][i], drawSettings);
        bikes.push(bike);
    };

    for (let i = 0; i < bikes.length; i++) {
        bounds.y_min = Math.min(bounds.y_min, bikes[i].r.min_y);
        bounds.x_min = Math.min(bounds.x_min, bikes[i].r.min_x);
        bounds.x_max = Math.max(bounds.x_max, bikes[i].r.max_x);
        bounds.y_max = Math.max(bounds.y_max, bikes[i].r.max_y);
    };


    drawNames(bikes, paper, bounds.x_min, bounds.y_min);

    bounds.dx = bounds.x_max - bounds.x_min;
    bounds.dy = bounds.y_max - bounds.y_min;

    // TODO: Refactor draw function out of Bike() into a new module. Then...
    // TODO: Draw(bikes[i], ... );

    for (let i = 0; i < bikes.length; i++) {
        bikes[i].draw(paper, drawSettings['colours'][i % drawSettings['colours'].length], 0, 0);
    };

    bbox = paper.getBBox();
    start_zoom = Math.min($(bikecanvas).height()*0.9/bounds.dy, $(bikecanvas).width()*0.9/bounds.dx);

    // Use snap.svg's zpd plugin.

    paper.zpd();

    paper.zoomTo(
        start_zoom, 0, null, function (err, paper) {
    });

    paper.panTo(
        $(bikecanvas).width()/2, $(bikecanvas).height()/2, 0, null, function (err, paper) {
    });

}