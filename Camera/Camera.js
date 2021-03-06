pc.script.create('camera', function (context) {
    // Creates a new Camera instance
    var Camera = function (entity) {
        this.entity = entity;

        this.distance = 8;
        this.height = 0;
        this.orbitAngle = 0;
        
    };

    Camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringW = context.root._children[0].script.HIDInterface.stringW;
            this.stringW.on("moving", this.move_W, this.direction, this.distance, this.speed, this.orbitAngle);

			this.bgplane = this.entity.findByName("Plane");
            this.aura1 = this.entity.findByName("Aura1");
            this.aura2 = this.entity.findByName("Aura2");
            this.aura3 = this.entity.findByName("Aura3");
            //this.aura1Mat = context.assets.find("BeliefAura1", pc.asset.ASSET_MATERIAL).resource;
            this.aura1Mat = this.aura1.model.model.getMaterials()[0];
            this.aura2Mat = this.aura2.model.model.getMaterials()[0];
            this.aura3Mat = this.aura3.model.model.getMaterials()[0];
			
        },
        
        move_W: function(position, distance, speed, orbitAngle) {
			if(position>0) {
			    context.root.findByName("Camera").script.camera.orbitAngle++;
			}
			else context.root.findByName("Camera").script.camera.orbitAngle--;
		},

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
	
			// Rotate plane background
			this.bgplane.rotateLocal(0, dt*-2, 0);
            // Rotate belief auras
            this.aura1.rotateLocal(0, dt*4, 0);
            this.aura2.rotateLocal(0, dt*8, 0);
            this.aura3.rotateLocal(0, dt*-6, 0);

            // Scale belief aura
            var maxScale = 6.5;
            var minScale = 3.5;
            this.aura1.setLocalScale(minScale + maxScale*totalBelief/maxTotalBelief, minScale + maxScale*totalBelief/maxTotalBelief, minScale + maxScale*totalBelief/maxTotalBelief);
            this.aura2.setLocalScale(minScale + maxScale*totalBelief/maxTotalBelief, minScale + maxScale*totalBelief/maxTotalBelief, minScale + maxScale*totalBelief/maxTotalBelief);
            this.aura3.setLocalScale(minScale + maxScale*totalBelief/maxTotalBelief, minScale + maxScale*totalBelief/maxTotalBelief, minScale + maxScale*totalBelief/maxTotalBelief);
            // Change aura color
            if(totalBelief < prevTotalBelief) {
                this.aura1Mat.diffuse = new pc.Color(1.0,0.25,0.25);
                this.aura2Mat.diffuse = new pc.Color(1.0,0.5,0.5);
                this.aura3Mat.diffuse = new pc.Color(1.0,0.75,0.75);
            } else if(totalBelief > prevTotalBelief) {
                this.aura1Mat.diffuse = new pc.Color(0.25,1.0,0.25);
                this.aura2Mat.diffuse = new pc.Color(0.5,1.0,0.5);
                this.aura3Mat.diffuse = new pc.Color(0.75,1.0,0.75);
            } else {
                this.aura1Mat.diffuse = new pc.Color(0.25,0.25,0.25);
                this.aura2Mat.diffuse = new pc.Color(0.5,0.5,0.5);
                this.aura3Mat.diffuse = new pc.Color(0.75,0.75,0.75);
            }
            this.aura1Mat.update();
            this.aura2Mat.update();
            this.aura3Mat.update();
            //console.log(totalBelief);

            if (context.keyboard.isPressed(pc.input.KEY_LEFT)) {
                this.orbitAngle++;
            }
            if (context.keyboard.isPressed(pc.input.KEY_RIGHT)) {
                this.orbitAngle--;
            }
            if (context.keyboard.isPressed(pc.input.KEY_UP)) {
                this.distance-= 0.1;
            }
            if (context.keyboard.isPressed(pc.input.KEY_DOWN)) {
                this.distance+= 0.1;
            }

            var cameraEntity = this.entity;
            var sphereEntity = context.root.findByName('Sphere');

            // Step 1: Place the camera where the sphere is
            cameraEntity.setPosition(sphereEntity.getPosition());

            // Step 2: Rotate the ball around the world Y (up) axis by some stored angle
            cameraEntity.setEulerAngles(0, this.orbitAngle, 0);

            // Step 3: Move the camera backwards by some 'distance' and up by some 'height'
            // Note that a camera looks down its negative Z local axis. So if this.distance
            // is a positive number, it will move backwards.
            cameraEntity.translateLocal(0, this.height, this.distance);

            // Step 4: Look at the ball from the camera's new position
            cameraEntity.lookAt(sphereEntity.getPosition());}
    };

    return Camera;
});
