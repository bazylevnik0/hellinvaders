import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

var LEVEL = 1;

console.log("debug test:",3);

// Creating the common stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera_group = new THREE.Group();
camera_group.position.set(0,0,5);
camera_group.add( camera );
scene.add(camera_group);
const raycaster = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );

// Cr*eating invaders
var invaders = [];
function create_invader () {
  let invader_geometry = new THREE.BoxGeometry( 1, 1, 1 );
  let invader_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  let invader  = new THREE.Mesh( invader_geometry, invader_material );
      invader.position.y = 50;
      invader.position.x = Math.random()*100-50;
      invader.position.z = Math.random()*100-50;
      	invader.name = "invader";
      scene.add( invader );
      invaders.push( invader );
}

// Creating ground
let ground_geometry = new THREE.PlaneGeometry( 1000, 1000 );
let ground_material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
var ground          = new THREE.Mesh( ground_geometry, ground_material );
		ground.position.y = -1;
		ground.rotation.x = Math.PI/2
		scene.add( ground );

// Creating gun
let gun_geometry = new THREE.BoxGeometry( 1, 1, 1 );
let gun_material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
var gun          = new THREE.Mesh( gun_geometry, gun_material );
    gun.position.z = 4;
    gun.position.y = 0.5;
    scene.add( gun );

// Creating laser
let laser_geometry = new THREE.BoxGeometry( 0.1, 0.1, 1000 );
let laser_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var laser          = new THREE.Mesh( laser_geometry, laser_material );
    laser.position.z = 4;
    laser.position.y = 0.5;
    scene.add( laser );

// Render function
function animate() {
  if (renderer.xr.isPresenting) {
    // Randomly with dependency to the level create invaders
    let   r = Math.floor(Math.random()*(100/LEVEL));
    if ( !r ) create_invader();

    // Update camera information
    let camera_xr = renderer.xr.getCamera();
	  let direction = new THREE.Vector3();
	  camera_xr.getWorldDirection(direction)
	  raycaster.set( camera_group.position, direction );


	  // Update gun and laser rotation and position
		gun.rotation.x = camera_xr.rotation.x;
		gun.rotation.y = camera_xr.rotation.y;
		gun.rotation.z = camera_xr.rotation.z;
		laser.rotation.x = camera_xr.rotation.x;
		laser.rotation.y = camera_xr.rotation.y;
		laser.rotation.z = camera_xr.rotation.z;

		let start_position = new THREE.Vector3(0,0,0);
		start_position = direction.clone();
		start_position.multiplyScalar(2)

		//console.log(start_position)
		let fix_position = new THREE.Vector3( 0, 0.5, 5);
		start_position.add(fix_position)
		gun.position.x = start_position.x;
		gun.position.y = start_position.y;
		gun.position.z = start_position.z;

		start_position.add(direction.multiplyScalar(500))

		laser.position.x = start_position.x;
		laser.position.y = start_position.y;
		laser.position.z = start_position.z;

		// Check intersection of the ray from camera
	  const intersects = raycaster.intersectObjects( scene.children );
	  for ( let i = 0; i < intersects.length; i ++ ) {
		  if (intersects[i].object.name == "invader") {
        intersects[ i ].object.material.color.set( 0xffffff );
      }
	  }

    // Move all invaders and if needed remove
    for ( let i = 0; i < invaders.length; i++ ) {
	    invaders[i].position.y -= 0.1;
	    if ( invaders[i].position.y < -1 ) {
	      scene.remove( invaders[i] );
        invaders.splice( i, 1 );
	    }
    }


	}
  renderer.render( scene, camera );
}
