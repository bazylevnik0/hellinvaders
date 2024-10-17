import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

var Loader = {};

Loader.load = function ( scene ) {

    // Creating invaders
    Loader.invader = {};
    Loader.invaders = [];
    Loader.invader.create = function ( scene ) {
      Loader.invader.geometry = new THREE.BoxGeometry( 1, 1, 1 );
      Loader.invader.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
      Loader.invader.mesh     = new THREE.Mesh( Loader.invader.geometry, Loader.invader.material );
      Loader.invader.mesh.position.y = 50;
      Loader.invader.mesh.position.x = Math.random()*100-50;
      Loader.invader.mesh.position.z = Math.random()*100-50;
      Loader.invader.mesh.name = "invader";
      scene.add( Loader.invader.mesh );
      Loader.invaders.push( Loader.invader.mesh );
    }

    // Creating ground
    Loader.ground = {};
    Loader.ground.geometry = new THREE.PlaneGeometry( 1000, 1000 );
    Loader.ground.material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
    Loader.ground.mesh     = new THREE.Mesh( Loader.ground.geometry, Loader.ground.material );
    Loader.ground.mesh.position.y = -1;
    Loader.ground.mesh.rotation.x = Math.PI/2
    scene.add( Loader.ground.mesh );

    // Creating gun
    Loader.gun = {};
    Loader.gun.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    Loader.gun.material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    Loader.gun.mesh     = new THREE.Mesh( Loader.gun.geometry, Loader.gun.material );
    Loader.gun.mesh.position.z = 4;
    Loader.gun.mesh.position.y = 0.5;
    scene.add( Loader.gun.mesh );

    // Creating laser
    Loader.laser = {};
    Loader.laser.geometry = new THREE.BoxGeometry( 0.1, 0.1, 1000 );
    Loader.laser.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    Loader.laser.mesh    = new THREE.Mesh( Loader.laser.geometry, Loader.laser.material );
    Loader.laser.mesh.position.z = 4;
    Loader.laser.mesh.position.y = 0.5;
    scene.add( Loader.laser.mesh );

    // Creating text
    Loader.text = {};
    Loader.text.loader = new FontLoader();
    Loader.text.loader.load( 'PixelifySansMedium_Regular.json', function ( font ) {

	    Loader.text.geometry = new TextGeometry( 'LEVEL: 0', {
		    font: font,
		    size: 80,
		    bevelEnabled: false,
	    } );
	    Loader.text.geometry.center();
	    Loader.text.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
      Loader.text.mesh     = new THREE.Mesh( Loader.text.geometry, Loader.text.material );
      Loader.text.mesh.position.z = 4;
      Loader.text.mesh.position.y = 0.5;
      Loader.text.mesh.scale.x = 0.005;
      Loader.text.mesh.scale.y = 0.005;
      Loader.text.mesh.scale.z = 0.0;
      scene.add( Loader.text.mesh );

      Loader.text.loaded = true;
    } );

}
export default Loader;
