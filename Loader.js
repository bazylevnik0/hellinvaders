import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
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
    Loader.ground.loader = new GLTFLoader();
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
    Loader.gun.loader = new GLTFLoader();
    Loader.laser.geometry = new THREE.BoxGeometry( 0.1, 0.1, 1000 );
    Loader.laser.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    Loader.laser.mesh    = new THREE.Mesh( Loader.laser.geometry, Loader.laser.material );
    Loader.laser.mesh.position.z = 4;
    Loader.laser.mesh.position.y = 0.5;
    scene.add( Loader.laser.mesh );

    // Creating text
    Loader.text = {};
    Loader.text.loader = new FontLoader();
    //Load Sky
    Loader.sky = {};
    Loader.sky.loader = new RGBELoader();
    Loader.sky.loader.load( '/assets/mud_road_puresky_1k.hdr', function ( texture ) {

		  texture.mapping = THREE.EquirectangularReflectionMapping;

		  scene.background = texture;
		  scene.environment = texture;
      // Load Ground
      Loader.ground.loader.load( '/assets/Castle/Castle_Building_Blocks/post-castle.glb', (gltf_ground)=> {
          scene.add(gltf_ground.scene);
          // Load text
          Loader.text.loader.load( '/assets/PixelifySansMedium_Regular.json', function ( font ) {

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

          Loader.loaded = true;
        });
      });
    });
}
export default Loader;
