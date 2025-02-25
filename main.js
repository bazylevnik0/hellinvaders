import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import Loader from './Loader.js';
import Player from './Player.js';

// Creating the common stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const listener = new THREE.AudioListener();
camera.add( listener );
const camera_group = new THREE.Group();
camera_group.position.set(0,5,5);
camera_group.add( camera );
scene.add(camera_group);
const raycaster = new THREE.Raycaster();
const light_ambient = new THREE.AmbientLight( 0x404040 ); // soft white light
		  light_ambient.intensity = 5;
      scene.add( light_ambient );
const light_point = new THREE.PointLight( 0x404040, 10, 5000 );
      light_point.position.set( 0, 10, 0 );
      scene.add( light_point );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );

// Start to load
Loader.clock = new THREE.Clock();
Loader.load( scene , listener); renderer.setAnimationLoop( animate );
// Show the enter to vr button when sky is loaded
let loading = setInterval ( ()=> {
  if (Loader.sky.loaded) {
    renderer.render( scene, camera );
    document.body.appendChild( VRButton.createButton( renderer ) );
    clearInterval(loading);
  }
},50);
function animate() {
  if (renderer.xr.isPresenting) {
    // When loaded start animate and play
    if (Loader.loaded) {
      let delta = Loader.clock.getDelta();
	    for ( let i = 0; i < Loader.invaders_mixers.length; i++) {
	        Loader.invaders_mixers[i].update( delta );
	    }
      Player.play(scene, camera_group, renderer, raycaster, Loader);
	  }
	  renderer.render( scene, camera );
	}
}
