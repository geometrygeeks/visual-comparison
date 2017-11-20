/*globals document, window,  */

/**
 * Created by davidtoy on 2017-June-13
 */

var input_bikes = [
    {
        'name': 'Giant Defy 2015 L',
        'reach': 390,
        'stack': 604,
        'top_tube': 575,
        'seat_tube_length': 525,
        'head_angle': 72.5,
        'seat_angle': 73,
        'head_tube': 205,
        'chainstay': 420,
        'wheelbase': 1022,
        'standover': 813,
        'bb_drop': 50,  // positive bb drop is earthwards
        'rake': 48,
        'trail': 61,
        'wheel_size': 622, // 622 is 700c
        'tire_width': 20,
        'head_tube_top_cap': 10,
        'head_tube_spacer': 15,
        'stem_height': 20,
        'stem_angle': -6,
        'stem_length': 110,
        'crank': 175,
    },
    {
        'name': 'Specialized Allez Sprint',
        'reach': 395,
        'stack': 554,
        'top_tube': 554,
        'seat_tube_length': 520,
        'head_angle': 73.5,
        'seat_angle': 74,
        'head_tube': 150,
        'chainstay': 405,
        'wheelbase': 984,
        'standover': 589,
        'bb_drop': 69,  // positive bb drop is earthwards
        'bb_height': 272,  // positive bb drop is earthwards
        'rake': 44,
        'trail': 55,
        'stem_length': 100,
        'crank': 172,

        'fork_length': 368,
        'seatpost_length': 330,

        'wheel_size': 622, // 622 is 700c
        'tire_width': 20,
        'head_tube_top_cap': 10,
        'head_tube_spacer': 15,
        'stem_height': 20,
        'stem_angle': -6,

    },
    {
        'name': 'Weird Bike',
        'reach': 295,
        'stack': 594,
        'top_tube': 554,
        'seat_tube_length': 520,
        'head_angle': 73.5,
        'seat_angle': 75,
        'head_tube': 150,
        'chainstay': 405,
        'wheelbase': 984,
        'standover': 589,
        'bb_drop': 30,  // positive bb drop is earthwards
        'rake': 44,
        'trail': 55,
        'stem_length': 100,
        'crank': 172,

        'fork_length': 368,
        'seatpost_length': 330,

        'wheel_size': 622, // 622 is 700c
        'tire_width': 20,
        'head_tube_top_cap': 10,
        'head_tube_spacer': 15,
        'stem_height': 20,
        'stem_angle': -6,

    }
];

function drawBikeComparison() {
    "use strict";

    var bikecanvas = "#visual_bike",
        bikes = [],
        colours = ['#008744', '#0057e7', '#d62d20', '#ffa700'],
        inputs = window.raw_bikes || input_bikes,
        scale_factor = 4,
        paper = Snap.select(bikecanvas),
        bounds = {
            x_min: 0,
            x_max: 0,
            y_min: 0,
            y_max: 0,
        },
        start_zoom,
        bbox;

    var Bike = function (initMeasurements) {

        // Define some default values / core assumptions.
        // Values are in mm.

        // This 'i' = input values.
        this.i = {
            'wheel_size': 622, // 622 is 700c
            'tire_width': 20,
            'head_tube_top_cap': 10,
            'head_tube_spacer': 15,
            'stem_height': 20,
            'stem_angle': -6,
        };

        // Update defaults with inputs
        for (var attrname in initMeasurements) {
            this.i[attrname] = initMeasurements[attrname];
        }


        // This 'r' = resolved values -  resolved immediately when the Bike is instantiated.
        // TODO: (Possibly?) create calculate() and inti() functions?

        this.r = {};

        // Define origin - Bottom Bracket center x, y.
        this.r.bb_cx = 0;
        this.r.bb_cy = 0;
        

        // Start with Stack and Reach
        // Define front cockpit point, then work back along the virtual top tube line.
        //
        if (this.i.hasOwnProperty('stack') && this.i.hasOwnProperty('reach')){

            this.r.stack_reach_x = this.r.bb_cx + this.i.reach / scale_factor;
            this.r.stack_reach_y = this.r.bb_cy - this.i.stack / scale_factor;

            this.r.virtual_top_tube_rear_x = this.r.bb_cx - this.i.stack / scale_factor / Snap.tan(this.i.seat_angle);
            this.r.virtual_top_tube_rear_y = this.r.stack_reach_y;
        } else if (this.i.hasOwnProperty('seat_angle') && this.i.hasOwnProperty('seat_tube_length') && this.i.hasOwnProperty('top_tube')) {


          // TODO: Develop method for bikes where stack and reach are unknown.


        }

        // Calculate the seat tube, and seat stays.

        this.r.seat_tube_top_x = this.r.bb_cx - Snap.cos(this.i.seat_angle) * this.i.seat_tube_length / scale_factor;
        this.r.seat_tube_top_y = this.r.bb_cy - Snap.sin(this.i.seat_angle) * this.i.seat_tube_length / scale_factor;

        this.r.seat_stays_top_x = this.r.bb_cx - Snap.cos(this.i.seat_angle) * this.i.seat_tube_length * 0.90 / scale_factor;
        this.r.seat_stays_top_y = this.r.bb_cy - Snap.sin(this.i.seat_angle) * this.i.seat_tube_length * 0.90 / scale_factor;
    

        // Compute a virtual steer axis.
        // This will run down through the head tube, and could eventually be used for Trail.

        if (this.i.hasOwnProperty('bb_height')){
            this.r.virtual_steer_axis_bottom_y = this.i.bb_height / scale_factor;
            this.r.virtual_steer_axis_bottom_x = this.r.stack_reach_x +  (this.i.bb_height / scale_factor - this.r.stack_reach_y) / Snap.tan(this.i.head_angle);
        } else {
            this.r.virtual_steer_axis_bottom_x = this.r.stack_reach_x +  (0 - this.r.stack_reach_y) / Snap.tan(this.i.head_angle);
            this.r.virtual_steer_axis_bottom_y = 0;
        }

        // Compute the head tube ends
        this.r.head_tube_bottom_x = this.r.stack_reach_x + Snap.cos(this.i.head_angle) * this.i.head_tube / scale_factor;
        this.r.head_tube_bottom_y = this.r.stack_reach_y + Snap.sin(this.i.head_angle) * this.i.head_tube / scale_factor;

        // Compute the top tube ends
        this.r.top_tube_front_x = this.r.stack_reach_x + Snap.cos(this.i.head_angle) * this.i.head_tube * 0.05 / scale_factor;
        this.r.top_tube_front_y = this.r.stack_reach_y + Snap.sin(this.i.head_angle) * this.i.head_tube * 0.05 / scale_factor;
    
        // Compute the down tube front - the back is the bottom bracket
        this.r.down_tube_front_x = this.r.stack_reach_x + Snap.cos(this.i.head_angle) * this.i.head_tube * 0.80 / scale_factor;
        this.r.down_tube_front_y = this.r.stack_reach_y + Snap.sin(this.i.head_angle) * this.i.head_tube * 0.80 / scale_factor;
    
        // Compute token headset

        this.r.steerer_tube_top_x = this.r.stack_reach_x - Snap.cos(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height) / scale_factor;
        this.r.steerer_tube_top_y = this.r.stack_reach_y - Snap.sin(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height) / scale_factor;

        // Compute stem
        this.r.stem_rear_x = this.r.stack_reach_x - Snap.cos(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height/2) / scale_factor;
        this.r.stem_rear_y = this.r.stack_reach_y - Snap.sin(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height/2 ) / scale_factor;
        this.r.stem_forward_x = this.r.stem_rear_x  + Snap.cos(90 - this.i.head_angle + this.i.stem_angle) * this.i.stem_length /scale_factor;
        this.r.stem_forward_y = this.r.stem_rear_y - Snap.sin(90 - this.i.head_angle + this.i.stem_angle) * this.i.stem_length /scale_factor;

        // Compute Cranks
        if (this.i.hasOwnProperty('crank_length')){
            this.r.crank_length = this.i.crank_length / scale_factor;
            this.r.crank_forward_x = this.r.bb_cx + Snap.cos(6) * this.r.crank_length;
            this.r.crank_forward_y = this.r.bb_cy + Snap.sin(6) * this.r.crank_length;
        }

        // Compute Wheel Radius
        if (this.i.hasOwnProperty('wheel_size')){
            this.r.wheel_r = (this.i.wheel_size/2 + this.i.tire_width) / scale_factor;
        }

        // Compute wheel height - either using bb_drop or bb_height - most manufs give one or other, sometimes both.
        if (this.i.hasOwnProperty('bb_drop')){
            this.r.backwheel_cy = this.r.bb_cy - this.i.bb_drop / scale_factor;
            this.r.frontwheel_cy  = this.r.backwheel_cy;
            this.r.backwheel_cx = this.r.bb_cx - Math.sqrt( Math.pow(this.i.chainstay, 2) - Math.pow(this.i.bb_drop, 2)) / scale_factor;
            this.r.frontwheel_cx = this.r.backwheel_cx + this.i.wheelbase / scale_factor;
        } else if (this.i.hasOwnProperty('bb_height') && this.r.hasOwnProperty('wheel_r')){
            this.r.backwheel_cy = this.r.bb_cy + this.i.bb_height / scale_factor - this.r.wheel_r  ;
            this.r.backwheel_cx = this.r.bb_cx - Math.sqrt( Math.pow(this.i.chainstay/ scale_factor, 2) - Math.pow(Math.abs(this.r.wheel_r - this.i.bb_height / scale_factor), 2));
            this.r.frontwheel_cy = this.r.backwheel_cy;
            this.r.frontwheel_cx = this.r.backwheel_cx + this.i.wheelbase / scale_factor;

        } else {
            throw 'No wheel size defined for ' + this.i.title + '\n  We expect either bb_drop or bb_height and wheel_r to be defined.';
        }

        // bb_height - useful for figuring out where the ground is.

        if (this.i.hasOwnProperty('bb_height')){
            this.r.bb_height = this.i.bb_height / scale_factor;
        } else {
            this.r.bb_height = this.r.wheel_r - this.i.bb_drop / scale_factor;
        }

        // Compute seatpost top, if seatpost length available.
        if (this.i.hasOwnProperty('seatpost_length')){
            this.r.seatpost_top_x = this.r.bb_cx - Snap.cos(this.i.seat_angle) * (this.i.seatpost_length - this.i.seat_tube_length / scale_factor);
            this.r.seatpost_top_y = this.r.bb_cy - Snap.sin(this.i.seat_angle) * (this.i.seatpost_length - this.i.seat_tube_length / scale_factor);
        }

        // Calculate {max, min} {x, y} as bounding box around bike.
        this.r.max_y = this.r.bb_height;


        if (this.r.hasOwnProperty('seatpost_top_y')){
            this.r.min_y = Math.min(this.r.stem_rear_y, this.r.seatpost_top_y);
        } else {
            this.r.min_y = this.r.stem_rear_y;
        }
        this.r.min_x = this.r.backwheel_cx - this.r.wheel_r;
        this.r.max_x = this.r.frontwheel_cx + this.r.wheel_r;


        // Array for storing drawing objects.

        this.drawObjs = [];

        // Draw function.
        // x_offset, y_offset included for positioning on canvas.

        this.draw = function (paper, frameColour, x_offset, y_offset){

            if (!this.r.hasOwnProperty('stack_reach_x')){
                return;
            }

            var frameColour = frameColour || "#AAAAAA",
                x_offset = x_offset || 0,
                y_offset = y_offset || 0,
                frameSettings = {
                    stroke: frameColour,
                    strokeWidth: 4,
                    "stroke-opacity": 1
                },
                wheelSeetings = {
                    fill: "transparent",
                    "stroke-opacity": 0.8,
                    stroke: "#aaa",
                    strokeWidth: this.i.tire_width / scale_factor
                };
                
            this.drawObjs['virtual_steer_axis'] = paper.line(this.r['stack_reach_x'], this.r['stack_reach_y'], this.r['virtual_steer_axis_bottom_x'], this.r['virtual_steer_axis_bottom_y']);
            this.drawObjs['virtual_steer_axis'].attr({
                stroke: "#bbb",
                strokeWidth: 1,
                "stroke-opacity": 0.5
            });

            this.drawObjs['virtual_top_tube'] = paper.line(this.r['stack_reach_x'], this.r['stack_reach_y'], this.r['virtual_top_tube_rear_x'], this.r['virtual_top_tube_rear_y']);
            this.drawObjs['virtual_top_tube'].attr({
                stroke: "#bbb",
                strokeWidth: 1,
                "stroke-opacity": 0.5
            });

            this.drawObjs['rear_wheel'] = paper.circle(this.r['backwheel_cx'], this.r['backwheel_cy'], this.r['wheel_r']).attr(wheelSeetings);

            if( this.r.hasOwnProperty('frontwheel_cx') && !isNaN(this.r['frontwheel_cx']) ){
                this.drawObjs['front_wheel'] = paper.circle(this.r['frontwheel_cx'], this.r['frontwheel_cy'], this.r['wheel_r']).attr(wheelSeetings);
            }

            this.drawObjs['sr_circle'] = paper.circle(this.r['stack_reach_x'], this.r['stack_reach_y'], 5);
            this.drawObjs['sr_circle'].attr({
                fill: "#2c3e50",
                stroke: "#2c3e50",
                strokeWidth: 1
            });

            this.drawObjs['chainstays'] = paper.line(this.r['backwheel_cx'], this.r['backwheel_cy'], this.r['bb_cx'], this.r['bb_cy']);
            this.drawObjs['chainstays'].attr(frameSettings);
            this.drawObjs['chainstays'].attr({
                strokeWidth: 2
            });
            this.drawObjs['seat_tube'] = paper.line(this.r['seat_tube_top_x'], this.r['seat_tube_top_y'], this.r['bb_cx'], this.r['bb_cy']);
            this.drawObjs['seat_tube'].attr(frameSettings);


            this.drawObjs['seatstays'] = paper.line(this.r['seat_stays_top_x'], this.r['seat_stays_top_y'], this.r['backwheel_cx'], this.r['backwheel_cy']);
            this.drawObjs['seatstays'].attr(frameSettings);
            this.drawObjs['seatstays'].attr({
                strokeWidth: 2
            });

            this.drawObjs['top_tube'] = paper.line(this.r['top_tube_front_x'], this.r['top_tube_front_y'], this.r['seat_tube_top_x'], this.r['seat_tube_top_y']);
            this.drawObjs['top_tube'].attr(frameSettings);


            this.drawObjs['head_tube'] = paper.line(this.r['stack_reach_x'], this.r['stack_reach_y'], this.r['head_tube_bottom_x'], this.r['head_tube_bottom_y']);
            this.drawObjs['head_tube'].attr(frameSettings);

            this.drawObjs['steerer_tube'] = paper.line(this.r['head_tube_bottom_x'], this.r['head_tube_bottom_y'], this.r['steerer_tube_top_x'], this.r['steerer_tube_top_y']);
            this.drawObjs['steerer_tube'].attr(frameSettings);

            if( this.r.hasOwnProperty('frontwheel_cx') && !isNaN(this.r['frontwheel_cx']) ){
                this.drawObjs['fork'] = paper.line(this.r['head_tube_bottom_x'], this.r['head_tube_bottom_y'], this.r['frontwheel_cx'], this.r['frontwheel_cy']).attr(frameSettings);
            };

            this.drawObjs['down_tube_straight'] = paper.line(this.r['bb_cx'], this.r['bb_cy'], this.r['down_tube_front_x'], this.r['down_tube_front_y']);
            this.drawObjs['down_tube_round_end'] = paper.circle(this.r['head_tube_bottom_x'], this.r['head_tube_bottom_y'], 2);
            this.drawObjs['down_tube_straight'].attr(frameSettings);
            this.drawObjs['down_tube_round_end'].attr({
                fill: frameColour,
                strokeWidth: 4
            });


            if (this.r.hasOwnProperty('crank_length')){
                this.drawObjs['crank'] = paper.line(
                        this.r['bb_cx'], this.r['bb_cy'],
                        this.r['crank_forward_x'], this.r['crank_forward_y']
                    ).attr({
                    stroke: "#777",
                    strokeWidth: 3
                });
            };


        }


    };

    function drawNames(bikes, paper, start_x, start_y) {
        var height = 20,
            x = start_x,
            y = start_y - 2 * height,
            names = [];

        for (var i = 0; i < bikes.length; i ++) {
            names.push(paper.text(x, y, bikes[i].i.title ).attr({'fill': colours[i % colours.length]}))
            y -= height;
        }

    }

    function drawGG(paper, start_x, start_y){
        var height = 20,
            drawingObjects = [];

        start_y += 2 * height;
        drawingObjects.push(paper.text(start_x, start_y, "Indicative Only" ).attr({'fill': '#777'}))

    }

    for (let i = 0; i < inputs.length; i++) {
        bikes.push(new Bike(inputs[i]));
    };

    for (let i = 0; i < bikes.length; i++) {
        bounds.y_min = Math.min(bounds.y_min, bikes[i].r.min_y);
        bounds.x_min = Math.min(bounds.x_min, bikes[i].r.min_x);
        bounds.x_max = Math.max(bounds.x_max, bikes[i].r.max_x);
        bounds.y_max = Math.max(bounds.y_max, bikes[i].r.max_y);
    };


    drawNames(bikes, paper, bounds.x_min, bounds.y_min);
    //drawGG(paper, bounds.x_min, bounds.y_max);

    bounds.dx = bounds.x_max - bounds.x_min;
    bounds.dy = bounds.y_max - bounds.y_min;


    for (let i = 0; i < bikes.length; i++) {
        bikes[i].draw(paper, colours[i % colours.length], 0, 0);
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