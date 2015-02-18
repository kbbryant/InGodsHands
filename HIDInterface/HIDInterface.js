///
// Description: This is the control input for all strings
// Modify move_* functions or use .on("move") events to listen to the strings' movement
///

pc.script.create('HIDInterface', function (context) {
    // Creates a new TestString instance
    var HIDInterface = function (entity) {
        this.entity = entity;
		pc.events.attach(this);
		
		this.direction, this.distance, this.speed = 0;
        
    };

	var temperatureChange;
	var temperatureDest;
	var velocity;

    HIDInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');
			
			temperatureChange = false;
			temperatureDest = 0.0;
			velocity = 0.0;
			
			this.stringT.on("moved", this.move_T, this.direction, this.distance, this.speed);
			this.stringA.on("moved", this.move_A, this.direction, this.distance, this.speed);
			this.stringP.on("moved", this.move_P, this.direction, this.distance, this.speed);
			this.stringE.on("moved", this.move_E, this.direction, this.distance, this.speed);
			this.stringW.on("moved", this.move_W, this.direction, this.distance, this.speed);

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	if(temperatureChange == true){
        		var tempTemperature = pc.math.lerp(globalTemperature, temperatureDest, velocity);
				globalTemperature = tempTemperature;

				if((globalTemperature - temperatureDest) == 0.0) {
					temperatureChange = false;
				}
        	}

        	//console.log(globalTemperature);
        	//console.log(temperatureDest);
        },
		
		move_T: function(position, distance, speed) {
			console.log("FIRED string T: ", position, distance, speed);
			 temperatureChange = true;
			 temperatureDest = globalTemperature + distance;
			 velocity = Math.abs((speed/distance) /10);
		},
		
		move_A: function(position, distance, speed) {
			console.log("FIRED string A: ", position, distance, speed);

		},
		
		move_P: function(position, distance, speed) {
			console.log("FIRED string P: ", position, distance, speed);

		},
		
		move_E: function(position, distance, speed) {
			console.log("FIRED string E: ", position, distance, speed);

		},
		
		move_W: function(position, distance, speed) {
			console.log("FIRED string W: ", position, distance, speed);

		},

    };

    return HIDInterface;
});