import * as THREE from 'three';

var Player = {};

Player.level = 20;

Player.play = function ( scene, camera_group, renderer, raycaster, Loader) {
  // Randomly with dependency to the level create invaders
    let   r = Math.floor(Math.random()*(100/Player.level));
    if ( !r ) Loader.invader.create(scene);

    // Update camera information
    let camera_xr = renderer.xr.getCamera();
	  let direction = new THREE.Vector3();
	  camera_xr.getWorldDirection(direction)
	  raycaster.set( camera_group.position, direction );

	  // Update gun and laser rotation and position
		Loader.gun.model.rotation.x = camera_xr.rotation.x;
		Loader.gun.model.rotation.y = camera_xr.rotation.y;
		Loader.gun.model.rotation.z = camera_xr.rotation.z;
		Loader.laser.mesh.rotation.x = camera_xr.rotation.x;
		Loader.laser.mesh.rotation.y = camera_xr.rotation.y;
		Loader.laser.mesh.rotation.z = camera_xr.rotation.z;
    Loader.text.mesh.rotation.x = camera_xr.rotation.x;
		Loader.text.mesh.rotation.y = camera_xr.rotation.y;
		Loader.text.mesh.rotation.z = camera_xr.rotation.z;

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
		    intersects[ i ].object.position.y = -2;
		    if (!Loader.sound.effect.audio.isPlaying ) {
		        Loader.sound.effect.audio.play();
		    }
      }
	  }

    // Move all invaders and if needed remove
    for ( let i = 0; i < Loader.invaders_boxes.length; i++ ) {
	    Loader.invaders_boxes[i].position.y -= 0.1;
	    Loader.invaders_models[i].position.y -= 0.1;
	    if ( Loader.invaders_boxes[i].position.y < -1 ) {
	      scene.remove( Loader.invaders_boxes[i] );
        Loader.invaders_boxes.splice( i, 1 );
        scene.remove( Loader.invaders_models[i] );
        Loader.invaders_models.splice( i, 1 );
        Loader.invaders_mixers.splice( i, 1 );
	    }
    }

}

export default Player;
