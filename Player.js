import * as THREE from 'three';

var Player = {};

Player.level = 0;
Player.score = 0;
Player.random = 5;
Player.speed = 2.5;

Player.play = function ( scene, camera_group, renderer, raycaster, Loader) {
    // Randomly with dependency to the level create invaders
    let   r = Math.floor(Math.random()*(100/Player.random));
    if ( !r ) Loader.invader.create(scene);

    // If needed update the game level
    if (Player.score >= 5 && Player.score < 15 && Player.level !== 1) {
        Player.level = 1;
        Player.speed *= 2;
        Loader.change_level(scene, 1);
        Loader.sound.win.audio.play();
    }
    if (Player.score >= 15 && Player.score < 40 && Player.level !== 2) {
        Player.level = 2;
        Player.speed *= 2;
        Loader.change_level(scene, 2);
        Loader.sound.win.audio.play();
    }
    if (Player.score >= 40 && Player.level !== 3) {
        Player.level = 3;
        Player.speed *= 2;
        Player.random *= 3;
        Loader.change_level(scene, 3);
        Loader.sound.win.audio.play();
    }

    // Update camera information
    let camera_xr = renderer.xr.getCamera();
	  let direction = new THREE.Vector3();
	  camera_xr.getWorldDirection(direction)
	  raycaster.set( camera_group.position, direction );

	  // Update effects of invaders
	  for (let i = 0; i < Loader.invaders_effects.length; i++) {
	    	Loader.invaders_effects[i].rotation.x = camera_xr.rotation.x;
		  Loader.invaders_effects[i].rotation.y = camera_xr.rotation.y;
		  Loader.invaders_effects[i].rotation.z = camera_xr.rotation.z;
	  }

	  // Update gun and laser rotation and position
		Loader.gun.model.rotation.x  = camera_xr.rotation.x;
		Loader.gun.model.rotation.y  = camera_xr.rotation.y;
		Loader.gun.model.rotation.z  = camera_xr.rotation.z;
		Loader.laser.mesh.rotation.x = camera_xr.rotation.x;
		Loader.laser.mesh.rotation.y = camera_xr.rotation.y;
		Loader.laser.mesh.rotation.z = camera_xr.rotation.z;
    Loader.text.mesh.rotation.x  = camera_xr.rotation.x;
		Loader.text.mesh.rotation.y  = camera_xr.rotation.y;
		Loader.text.mesh.rotation.z  = camera_xr.rotation.z;

		let start_position = new THREE.Vector3(0,0,0);
		start_position = direction.clone();
		start_position.multiplyScalar(2)


    let fix_position = new THREE.Vector3( 0, 3.5, 5);
		start_position.add(fix_position)
		Loader.gun.model.position.x = start_position.x;
		Loader.gun.model.position.y = start_position.y;
		Loader.gun.model.position.z = start_position.z;

		Loader.text.mesh.position.x = start_position.x;
		Loader.text.mesh.position.y = start_position.y+6;
		Loader.text.mesh.position.z = start_position.z;


		start_position.add(direction.multiplyScalar(500))

		Loader.laser.mesh.position.x = start_position.x;
		Loader.laser.mesh.position.y = start_position.y;
		Loader.laser.mesh.position.z = start_position.z;

		// Check intersection of the ray from camera
	  const intersects = raycaster.intersectObjects( scene.children );
	  for ( let i = 0; i < intersects.length; i ++ ) {
	    if (intersects[i].object.name == "invader") {
	      Player.score++;
		    intersects[ i ].object.position.y = -50;
		    if (!Loader.sound.effect.audio.isPlaying ) {
		        Loader.sound.effect.audio.play();
		    }
      }
	  }

    // Move all invaders and if needed remove
    for ( let i = 0; i < Loader.invaders_boxes.length; i++ ) {
	    Loader.invaders_boxes[i].position.y   -= Player.speed;
	    Loader.invaders_models[i].position.y  -= Player.speed;
	    Loader.invaders_effects[i].position.y -= Player.speed;
	    if ( Loader.invaders_boxes[i].position.y > -30 && Loader.invaders_boxes[i].position.y < -1 ) {
        if (!Loader.sound.lose.audio.isPlaying ) Loader.sound.lose.audio.play();
	    }
	    if ( Loader.invaders_boxes[i].position.y < -30 ) {
	      scene.remove( Loader.invaders_boxes[i] );
        Loader.invaders_boxes.splice( i, 1 );
        scene.remove( Loader.invaders_models[i] );
        Loader.invaders_models.splice( i, 1 );
        Loader.invaders_mixers.splice( i, 1 );
        scene.remove( Loader.invaders_effects[i]);
        Loader.invaders_effects.splice( i, 1 );
	    }

    }

}

export default Player;
