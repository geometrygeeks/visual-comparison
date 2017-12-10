export default Drawing;

function Drawing (bikeGeometry, paper, frameColour, x_offset, y_offset, settings) {


    this.i = bikeGeometry.inputMeasurements;
    this.r = bikeGeometry.resolvedPoint;

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
            strokeWidth: this.r.tire_thickness_r / settings['scale_factor']
        };

    // Array for storing drawing objects.
    this.drawObjs = [];

    this.draw = function(){

        if (!this.r.hasOwnProperty('stack_reach_x')){
            return;
        }


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

        this.drawObjs['rear_wheel'] = paper.circle(this.r['backwheel_cx'], this.r['backwheel_cy'], (this.r['wheel_outer_r'] - this.r['tire_thickness_r']/2)).attr(wheelSeetings);

        if( this.r.hasOwnProperty('frontwheel_cx') && !isNaN(this.r['frontwheel_cx']) ){
            this.drawObjs['front_wheel'] = paper.circle(this.r['frontwheel_cx'], this.r['frontwheel_cy'], this.r['wheel_outer_r']).attr(wheelSeetings);
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

}