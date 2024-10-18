import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import Loader from './Loader.js';
import Player from './Player.js';

console.log("debug test:",4);

// Creating the common stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera_group = new THREE.Group();
camera_group.position.set(0,5,5);
camera_group.add( camera );
scene.add(camera_group);
const raycaster = new THREE.Raycaster();
const light_ambient = new THREE.AmbientLight( 0x404040 ); // soft white light
		  light_ambient.intensity = 5;
      scene.add( light_ambient );
const light_point = new THREE.PointLight( 0x404040, 10, 1000 );
      light_point.position.set( 0, 10, 0 );
      scene.add( light_point );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );

Loader.load( scene ); renderer.setAnimationLoop( animate );
function animate() {
  if (Loader.loaded) {
    if (renderer.xr.isPresenting) {
      Player.play(scene, camera_group, renderer, raycaster, Loader);
	  }
	}
  renderer.render( scene, camera );
}
