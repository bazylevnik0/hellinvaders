import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import Loader from './Loader.js';
import Player from './Player.js';

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
renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );

Loader.load( scene ); renderer.setAnimationLoop( animate );
function animate() {
  if (Loader.text.loaded) {
    if (renderer.xr.isPresenting) {
      Player.play(scene, camera_group, renderer, raycaster, Loader);
	  }
	}
  renderer.render( scene, camera );
}
