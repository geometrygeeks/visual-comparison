
export default BikeGeometry;

function BikeGeometry(initMeasurements, settings) {

        this.error = false;
        this.error_parameters = [];

        this.inputMeasurements = {
            // Define some default values / core assumptions.
            // Values are in mm.
            'wheel_size': 622, // 622 is 700c
            'tire_width': 20,
            'head_tube_top_cap': 10,
            'head_tube_spacer': 15,
            'stem_height': 20,
            'stem_angle': -6,
        };

        // Update defaults with inputs
        for (var attrname in initMeasurements) {
            this.inputMeasurements[attrname] = initMeasurements[attrname];
        }

        // Remove degree symbols.
        this.inputMeasurements['seat_angle'] = parseFloat(this.inputMeasurements['seat_angle']);
        this.inputMeasurements['head_angle'] = parseFloat(this.inputMeasurements['head_angle']);


        // Calculated values - resolved immediately when the Bike is instantiated.
        this.resolvedPoint = {};

        // Define origin - Bottom Bracket center x, y.
        this.resolvedPoint.bb_cx = 0;
        this.resolvedPoint.bb_cy = 0;


        // Start with Stack and Reach
        // Define front cockpit point, then work back along the virtual top tube line.
        //
        if (this.inputMeasurements.hasOwnProperty('stack') && this.inputMeasurements.hasOwnProperty('reach')){

            this.resolvedPoint.stack_reach_x = this.resolvedPoint.bb_cx + this.inputMeasurements.reach / settings['scale_factor'];
            this.resolvedPoint.stack_reach_y = this.resolvedPoint.bb_cy - this.inputMeasurements.stack / settings['scale_factor'];

            this.resolvedPoint.virtual_top_tube_rear_x = this.resolvedPoint.bb_cx - this.inputMeasurements.stack / settings['scale_factor'] / Snap.tan(this.inputMeasurements.seat_angle);
            this.resolvedPoint.virtual_top_tube_rear_y = this.resolvedPoint.stack_reach_y;
        } else if (this.inputMeasurements.hasOwnProperty('seat_angle') && this.inputMeasurements.hasOwnProperty('seat_tube_length') && this.inputMeasurements.hasOwnProperty('top_tube')) {


          // TODO: Develop method for bikes where stack and reach are unknown.


        }

        // Calculate the seat tube, and seat stays.

        this.resolvedPoint.seat_tube_top_x = this.resolvedPoint.bb_cx - Snap.cos(this.inputMeasurements.seat_angle) * this.inputMeasurements.seat_tube_length / settings['scale_factor'];
        this.resolvedPoint.seat_tube_top_y = this.resolvedPoint.bb_cy - Snap.sin(this.inputMeasurements.seat_angle) * this.inputMeasurements.seat_tube_length / settings['scale_factor'];

        this.resolvedPoint.seat_stays_top_x = this.resolvedPoint.bb_cx - Snap.cos(this.inputMeasurements.seat_angle) * this.inputMeasurements.seat_tube_length * 0.90 / settings['scale_factor'];
        this.resolvedPoint.seat_stays_top_y = this.resolvedPoint.bb_cy - Snap.sin(this.inputMeasurements.seat_angle) * this.inputMeasurements.seat_tube_length * 0.90 / settings['scale_factor'];


        // Compute a virtual steer axis.
        // This will run down through the head tube, and could eventually be used for Trail.

        if (this.inputMeasurements.hasOwnProperty('bb_height')){
            this.resolvedPoint.virtual_steer_axis_bottom_y = this.inputMeasurements.bb_height / settings['scale_factor'];
            this.resolvedPoint.virtual_steer_axis_bottom_x = this.resolvedPoint.stack_reach_x +  (this.inputMeasurements.bb_height / settings['scale_factor'] - this.resolvedPoint.stack_reach_y) / Snap.tan(this.inputMeasurements.head_angle);
        } else {
            this.resolvedPoint.virtual_steer_axis_bottom_x = this.resolvedPoint.stack_reach_x +  (0 - this.resolvedPoint.stack_reach_y) / Snap.tan(this.inputMeasurements.head_angle);
            this.resolvedPoint.virtual_steer_axis_bottom_y = 0;
        }

        // Compute the head tube ends
        this.resolvedPoint.head_tube_bottom_x = this.resolvedPoint.stack_reach_x + Snap.cos(this.inputMeasurements.head_angle) * this.inputMeasurements.head_tube / settings['scale_factor'];
        this.resolvedPoint.head_tube_bottom_y = this.resolvedPoint.stack_reach_y + Snap.sin(this.inputMeasurements.head_angle) * this.inputMeasurements.head_tube / settings['scale_factor'];

        // Compute the top tube ends
        this.resolvedPoint.top_tube_front_x = this.resolvedPoint.stack_reach_x + Snap.cos(this.inputMeasurements.head_angle) * this.inputMeasurements.head_tube * 0.05 / settings['scale_factor'];
        this.resolvedPoint.top_tube_front_y = this.resolvedPoint.stack_reach_y + Snap.sin(this.inputMeasurements.head_angle) * this.inputMeasurements.head_tube * 0.05 / settings['scale_factor'];

        // Compute the down tube front - the back is the bottom bracket
        this.resolvedPoint.down_tube_front_x = this.resolvedPoint.stack_reach_x + Snap.cos(this.inputMeasurements.head_angle) * this.inputMeasurements.head_tube * 0.80 / settings['scale_factor'];
        this.resolvedPoint.down_tube_front_y = this.resolvedPoint.stack_reach_y + Snap.sin(this.inputMeasurements.head_angle) * this.inputMeasurements.head_tube * 0.80 / settings['scale_factor'];

        // Compute token headset

        this.resolvedPoint.steerer_tube_top_x = this.resolvedPoint.stack_reach_x - Snap.cos(this.inputMeasurements.head_angle) * (this.inputMeasurements.head_tube_top_cap + this.inputMeasurements.head_tube_spacer + this.inputMeasurements.stem_height) / settings['scale_factor'];
        this.resolvedPoint.steerer_tube_top_y = this.resolvedPoint.stack_reach_y - Snap.sin(this.inputMeasurements.head_angle) * (this.inputMeasurements.head_tube_top_cap + this.inputMeasurements.head_tube_spacer + this.inputMeasurements.stem_height) / settings['scale_factor'];

        // Compute stem
        this.resolvedPoint.stem_rear_x = this.resolvedPoint.stack_reach_x - Snap.cos(this.inputMeasurements.head_angle) * (this.inputMeasurements.head_tube_top_cap + this.inputMeasurements.head_tube_spacer + this.inputMeasurements.stem_height/2) / settings['scale_factor'];
        this.resolvedPoint.stem_rear_y = this.resolvedPoint.stack_reach_y - Snap.sin(this.inputMeasurements.head_angle) * (this.inputMeasurements.head_tube_top_cap + this.inputMeasurements.head_tube_spacer + this.inputMeasurements.stem_height/2 ) / settings['scale_factor'];
        this.resolvedPoint.stem_forward_x = this.resolvedPoint.stem_rear_x  + Snap.cos(90 - this.inputMeasurements.head_angle + this.inputMeasurements.stem_angle) * this.inputMeasurements.stem_length /settings['scale_factor'];
        this.resolvedPoint.stem_forward_y = this.resolvedPoint.stem_rear_y - Snap.sin(90 - this.inputMeasurements.head_angle + this.inputMeasurements.stem_angle) * this.inputMeasurements.stem_length /settings['scale_factor'];

        // Compute Cranks
        if (this.inputMeasurements.hasOwnProperty('crank_length')){
            this.resolvedPoint.crank_length = this.inputMeasurements.crank_length / settings['scale_factor'];
            this.resolvedPoint.crank_forward_x = this.resolvedPoint.bb_cx + Snap.cos(6) * this.resolvedPoint.crank_length;
            this.resolvedPoint.crank_forward_y = this.resolvedPoint.bb_cy + Snap.sin(6) * this.resolvedPoint.crank_length;
        }

        // Compute Wheel Radius
        if (this.inputMeasurements.hasOwnProperty('wheel_size')){
            if (this.inputMeasurements.wheel_size > 400){
                this.resolvedPoint.wheel_r = (this.inputMeasurements.wheel_size/2 + this.inputMeasurements.tire_width) / settings['scale_factor'];
            }
        }

        // Compute wheel height - either using bb_drop or bb_height - most manufs give one or other, sometimes both.
        if (this.inputMeasurements.hasOwnProperty('bb_drop')){
            this.resolvedPoint.backwheel_cy = this.resolvedPoint.bb_cy - this.inputMeasurements.bb_drop / settings['scale_factor'];
            this.resolvedPoint.frontwheel_cy  = this.resolvedPoint.backwheel_cy;
            this.resolvedPoint.backwheel_cx = this.resolvedPoint.bb_cx - Math.sqrt( Math.pow(this.inputMeasurements.chainstay, 2) - Math.pow(this.inputMeasurements.bb_drop, 2)) / settings['scale_factor'];
            this.resolvedPoint.frontwheel_cx = this.resolvedPoint.backwheel_cx + this.inputMeasurements.wheelbase / settings['scale_factor'];
        } else if (this.inputMeasurements.hasOwnProperty('bb_height') && this.resolvedPoint.hasOwnProperty('wheel_r')){
            this.resolvedPoint.backwheel_cy = this.resolvedPoint.bb_cy + this.inputMeasurements.bb_height / settings['scale_factor'] - this.resolvedPoint.wheel_r  ;
            this.resolvedPoint.backwheel_cx = this.resolvedPoint.bb_cx - Math.sqrt( Math.pow(this.inputMeasurements.chainstay/ settings['scale_factor'], 2) - Math.pow(Math.abs(this.resolvedPoint.wheel_r - this.inputMeasurements.bb_height / settings['scale_factor']), 2));
            this.resolvedPoint.frontwheel_cy = this.resolvedPoint.backwheel_cy;
            this.resolvedPoint.frontwheel_cx = this.resolvedPoint.backwheel_cx + this.inputMeasurements.wheelbase / settings['scale_factor'];

        }

        // bb_height - useful for figuring out where the ground is.

        if (this.inputMeasurements.hasOwnProperty('bb_height')){
            this.resolvedPoint.bb_height = this.inputMeasurements.bb_height / settings['scale_factor'];
        } else {
            this.resolvedPoint.bb_height = this.resolvedPoint.wheel_r - this.inputMeasurements.bb_drop / settings['scale_factor'];
        }

        // Compute seatpost top, if seatpost length available.
        if (this.inputMeasurements.hasOwnProperty('seatpost_length')){
            this.resolvedPoint.seatpost_top_x = this.resolvedPoint.bb_cx - Snap.cos(this.inputMeasurements.seat_angle) * (this.inputMeasurements.seatpost_length - this.inputMeasurements.seat_tube_length / settings['scale_factor']);
            this.resolvedPoint.seatpost_top_y = this.resolvedPoint.bb_cy - Snap.sin(this.inputMeasurements.seat_angle) * (this.inputMeasurements.seatpost_length - this.inputMeasurements.seat_tube_length / settings['scale_factor']);
        }

        // Calculate {max, min} {x, y} as bounding box around bike.
        this.resolvedPoint.max_y = this.resolvedPoint.bb_height;


        if (this.resolvedPoint.hasOwnProperty('seatpost_top_y')){
            this.resolvedPoint.min_y = Math.min(this.resolvedPoint.stem_rear_y, this.resolvedPoint.seatpost_top_y);
        } else {
            this.resolvedPoint.min_y = this.resolvedPoint.stem_rear_y;
        }
        this.resolvedPoint.min_x = this.resolvedPoint.backwheel_cx - this.resolvedPoint.wheel_r;
        this.resolvedPoint.max_x = this.resolvedPoint.frontwheel_cx + this.resolvedPoint.wheel_r;


        // Final check for NaNs - compute errors
        for (var property in this.resolvedPoint) {
            if (this.resolvedPoint.hasOwnProperty(property)) {
                if (this.resolvedPoint[property] !== this.resolvedPoint[property]) {
                    this.error = true;
                    this.error_parameters.push(property);
                }
            }
        }

    };