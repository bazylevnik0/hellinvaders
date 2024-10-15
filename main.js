import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

var LEVEL = 100;
console.log(1)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );

const camera_group = new THREE.Group();
camera_group.position.set(0,0,5);
camera_group.add( camera );
scene.add(camera_group);

var invaders = [];
function create_object () {
  let geometry = new THREE.BoxGeometry( 1, 1, 1 );
  let material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
  let invader  = new THREE.Mesh( geometry, material );
        invader.position.y = 10;
        invader.position.x = Math.random()*100-50;
        invader.position.z = Math.random()*100-50;
        scene.add( invader );
        invaders.push( invader );
}

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var gun      = new THREE.Mesh( geometry, material );
      gun.position.z = 4;
      gun.position.y = 0.5;
      scene.add( gun );

function animate() {
  let   r = Math.floor(Math.random()*(100/LEVEL));
  if ( !r ) create_object();
  for ( let i = 0; i < invaders.length; i++ ) {
	  invaders[i].position.y -= 0.1;
	  if ( invaders[i].position.y < -1 ) {
	    scene.remove( invaders[i] );
      invaders.splice( i, 1 );
	  }
  }
  if (renderer.xr.isPresenting) {
    let camera_xr = renderer.xr.getCamera();
		let direction = new THREE.Vector3();
		camera_xr.getWorldDirection(direction)
		gun.rotation.x = camera_xr.rotation.x;
		gun.rotation.y = camera_xr.rotation.y;
		gun.rotation.z = camera_xr.rotation.z;

		let start_position = new THREE.Vector3(0,0,0);
		start_position = direction.clone();
		start_position.multiplyScalar(2)
		//console.log(start_position)
		gun.position.x = start_position.x;
		gun.position.y = start_position.y+0.5;
		gun.position.z = start_position.z+5;

	}
  renderer.render( scene, camera );
}
