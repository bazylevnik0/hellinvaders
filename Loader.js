import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

var Loader = {};

Loader.load = function ( scene ) {
    // Creating invaders
    Loader.invader = {};
    Loader.invaders_boxes = [];
    Loader.invaders_models = [];
    Loader.invaders_mixers = [];
    Loader.invader.create = function ( scene ) {
      let invader_box = Loader.invader.mesh.clone();
          invader_box.position.y = 50;
          invader_box.position.x = Math.random()*100-50;
          invader_box.position.z = Math.random()*100-50;
          invader_box.name = "invader";
          invader_box.visible = false;
          invader_box.rotation.y = Math.random()*Math.PI*2;
          scene.add( invader_box );
          Loader.invaders_boxes.push( invader_box );

      let invader_model = Loader.invader.model.clone();
          invader_model.position.y = invader_box.position.y;
          invader_model.position.x = invader_box.position.x;
          invader_model.position.z = invader_box.position.z;
          invader_model.rotation.y = invader_box.rotation.y;
          scene.add( invader_model );
          Loader.invaders_models.push( invader_model );

      let invader_mixer = new THREE.AnimationMixer( invader_model );
				  invader_mixer.clipAction( Loader.invader.animations[ 0 ] ).play();
          invader_mixer.clipAction( Loader.invader.animations[ 1 ] ).play();
          invader_mixer.clipAction( Loader.invader.animations[ 2 ] ).play();
          Loader.invaders_mixers.push ( invader_mixer );

    }
    Loader.invader.loader = new GLTFLoader();

    // Creating ground
    Loader.ground = {};
    Loader.ground.loader = new GLTFLoader();
    scene.add( Loader.ground.mesh );

    // Creating gun
    Loader.gun = {};
    Loader.gun.loader = new GLTFLoader();
    Loader.gun.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    Loader.gun.material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    Loader.gun.mesh     = new THREE.Mesh( Loader.gun.geometry, Loader.gun.material );
    Loader.gun.mesh.position.z = 4;
    Loader.gun.mesh.position.y = 0.5;
    //scene.add( Loader.gun.mesh );

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
          // Load Gun
          Loader.ground.loader.load( '/assets/Gun/Gun+.glb', (gltf_gun)=> {
          Loader.gun.model = gltf_gun.scene;
          Loader.gun.model.scale.x = 0.5;
          Loader.gun.model.scale.y = 0.5;
          Loader.gun.model.scale.z = 0.5;
          scene.add(Loader.gun.model);
                //Load invader
                  Loader.invader.geometry = new THREE.BoxGeometry( 5, 5, 7.5 );
                  Loader.invader.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
                  Loader.invader.mesh     = new THREE.Mesh( Loader.invader.geometry, Loader.invader.material );

                  Loader.invader.loader.load( '/assets/Invader/FGC_Skeleton+.glb', (gltf_invader)=> {
                  Loader.invader.model = gltf_invader.scene;
                  Loader.invader.animations = gltf_invader.animations;
				          Loader.invader.mixer = new THREE.AnimationMixer( Loader.invader.model );
				          Loader.invader.model.position.x = 0;
				          Loader.invader.model.position.y = 2;
				          Loader.invader.model.position.z = 0;
				          Loader.invader.model.scale.x = 2.5;
				          Loader.invader.model.scale.y = 2.5;
				          Loader.invader.model.scale.z = 2.5;

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
      });
    });
}
export default Loader;
