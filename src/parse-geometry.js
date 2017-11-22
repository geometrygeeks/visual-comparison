
export default Bike;

function Bike(initMeasurements, settings) {

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

            this.r.stack_reach_x = this.r.bb_cx + this.i.reach / settings['scale_factor'];
            this.r.stack_reach_y = this.r.bb_cy - this.i.stack / settings['scale_factor'];

            this.r.virtual_top_tube_rear_x = this.r.bb_cx - this.i.stack / settings['scale_factor'] / Snap.tan(this.i.seat_angle);
            this.r.virtual_top_tube_rear_y = this.r.stack_reach_y;
        } else if (this.i.hasOwnProperty('seat_angle') && this.i.hasOwnProperty('seat_tube_length') && this.i.hasOwnProperty('top_tube')) {


          // TODO: Develop method for bikes where stack and reach are unknown.


        }

        // Calculate the seat tube, and seat stays.

        this.r.seat_tube_top_x = this.r.bb_cx - Snap.cos(this.i.seat_angle) * this.i.seat_tube_length / settings['scale_factor'];
        this.r.seat_tube_top_y = this.r.bb_cy - Snap.sin(this.i.seat_angle) * this.i.seat_tube_length / settings['scale_factor'];

        this.r.seat_stays_top_x = this.r.bb_cx - Snap.cos(this.i.seat_angle) * this.i.seat_tube_length * 0.90 / settings['scale_factor'];
        this.r.seat_stays_top_y = this.r.bb_cy - Snap.sin(this.i.seat_angle) * this.i.seat_tube_length * 0.90 / settings['scale_factor'];


        // Compute a virtual steer axis.
        // This will run down through the head tube, and could eventually be used for Trail.

        if (this.i.hasOwnProperty('bb_height')){
            this.r.virtual_steer_axis_bottom_y = this.i.bb_height / settings['scale_factor'];
            this.r.virtual_steer_axis_bottom_x = this.r.stack_reach_x +  (this.i.bb_height / settings['scale_factor'] - this.r.stack_reach_y) / Snap.tan(this.i.head_angle);
        } else {
            this.r.virtual_steer_axis_bottom_x = this.r.stack_reach_x +  (0 - this.r.stack_reach_y) / Snap.tan(this.i.head_angle);
            this.r.virtual_steer_axis_bottom_y = 0;
        }

        // Compute the head tube ends
        this.r.head_tube_bottom_x = this.r.stack_reach_x + Snap.cos(this.i.head_angle) * this.i.head_tube / settings['scale_factor'];
        this.r.head_tube_bottom_y = this.r.stack_reach_y + Snap.sin(this.i.head_angle) * this.i.head_tube / settings['scale_factor'];

        // Compute the top tube ends
        this.r.top_tube_front_x = this.r.stack_reach_x + Snap.cos(this.i.head_angle) * this.i.head_tube * 0.05 / settings['scale_factor'];
        this.r.top_tube_front_y = this.r.stack_reach_y + Snap.sin(this.i.head_angle) * this.i.head_tube * 0.05 / settings['scale_factor'];

        // Compute the down tube front - the back is the bottom bracket
        this.r.down_tube_front_x = this.r.stack_reach_x + Snap.cos(this.i.head_angle) * this.i.head_tube * 0.80 / settings['scale_factor'];
        this.r.down_tube_front_y = this.r.stack_reach_y + Snap.sin(this.i.head_angle) * this.i.head_tube * 0.80 / settings['scale_factor'];

        // Compute token headset

        this.r.steerer_tube_top_x = this.r.stack_reach_x - Snap.cos(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height) / settings['scale_factor'];
        this.r.steerer_tube_top_y = this.r.stack_reach_y - Snap.sin(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height) / settings['scale_factor'];

        // Compute stem
        this.r.stem_rear_x = this.r.stack_reach_x - Snap.cos(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height/2) / settings['scale_factor'];
        this.r.stem_rear_y = this.r.stack_reach_y - Snap.sin(this.i.head_angle) * (this.i.head_tube_top_cap + this.i.head_tube_spacer + this.i.stem_height/2 ) / settings['scale_factor'];
        this.r.stem_forward_x = this.r.stem_rear_x  + Snap.cos(90 - this.i.head_angle + this.i.stem_angle) * this.i.stem_length /settings['scale_factor'];
        this.r.stem_forward_y = this.r.stem_rear_y - Snap.sin(90 - this.i.head_angle + this.i.stem_angle) * this.i.stem_length /settings['scale_factor'];

        // Compute Cranks
        if (this.i.hasOwnProperty('crank_length')){
            this.r.crank_length = this.i.crank_length / settings['scale_factor'];
            this.r.crank_forward_x = this.r.bb_cx + Snap.cos(6) * this.r.crank_length;
            this.r.crank_forward_y = this.r.bb_cy + Snap.sin(6) * this.r.crank_length;
        }

        // Compute Wheel Radius
        if (this.i.hasOwnProperty('wheel_size')){
            this.r.wheel_r = (this.i.wheel_size/2 + this.i.tire_width) / settings['scale_factor'];
        }

        // Compute wheel height - either using bb_drop or bb_height - most manufs give one or other, sometimes both.
        if (this.i.hasOwnProperty('bb_drop')){
            this.r.backwheel_cy = this.r.bb_cy - this.i.bb_drop / settings['scale_factor'];
            this.r.frontwheel_cy  = this.r.backwheel_cy;
            this.r.backwheel_cx = this.r.bb_cx - Math.sqrt( Math.pow(this.i.chainstay, 2) - Math.pow(this.i.bb_drop, 2)) / settings['scale_factor'];
            this.r.frontwheel_cx = this.r.backwheel_cx + this.i.wheelbase / settings['scale_factor'];
        } else if (this.i.hasOwnProperty('bb_height') && this.r.hasOwnProperty('wheel_r')){
            this.r.backwheel_cy = this.r.bb_cy + this.i.bb_height / settings['scale_factor'] - this.r.wheel_r  ;
            this.r.backwheel_cx = this.r.bb_cx - Math.sqrt( Math.pow(this.i.chainstay/ settings['scale_factor'], 2) - Math.pow(Math.abs(this.r.wheel_r - this.i.bb_height / settings['scale_factor']), 2));
            this.r.frontwheel_cy = this.r.backwheel_cy;
            this.r.frontwheel_cx = this.r.backwheel_cx + this.i.wheelbase / settings['scale_factor'];

        }

        // bb_height - useful for figuring out where the ground is.

        if (this.i.hasOwnProperty('bb_height')){
            this.r.bb_height = this.i.bb_height / settings['scale_factor'];
        } else {
            this.r.bb_height = this.r.wheel_r - this.i.bb_drop / settings['scale_factor'];
        }

        // Compute seatpost top, if seatpost length available.
        if (this.i.hasOwnProperty('seatpost_length')){
            this.r.seatpost_top_x = this.r.bb_cx - Snap.cos(this.i.seat_angle) * (this.i.seatpost_length - this.i.seat_tube_length / settings['scale_factor']);
            this.r.seatpost_top_y = this.r.bb_cy - Snap.sin(this.i.seat_angle) * (this.i.seatpost_length - this.i.seat_tube_length / settings['scale_factor']);
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

    };