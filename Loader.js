import * as THREE from 'three';
import { GLTFLoader   } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader   } from 'three/addons/loaders/RGBELoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader   } from 'three/addons/loaders/FontLoader.js';

var Loader = {};

Loader.load = function ( scene , listener) {
    // Prepare arrays and loader for invaders with function to create them
    Loader.invader = {};
    Loader.invader.loader = new GLTFLoader();
    Loader.invaders_boxes = [];
    Loader.invaders_models = [];
    Loader.invaders_mixers = [];
    Loader.invaders_effects = [];
    Loader.invader.create = function ( scene ) {
      // Create the box, sort of collision box for raycaster, non-visible
      let invader_box = Loader.invader.mesh.clone();
          invader_box.position.y = 500;
          invader_box.position.x = Math.random()*750-375;
          invader_box.position.z = Math.random()*750-375;
          let check = false; let timer = 100;
          // Check if new invader near to to other or to player position try to find new place
          while (((invader_box.position.x > -250 && invader_box.position.x < 250) ||
                  (invader_box.position.z > -250 && invader_box.position.z < 250) || check ) && timer > 0 ) {
              check = false;
              invader_box.position.x = Math.random()*750-375;
              invader_box.position.z = Math.random()*750-375;

              for (let i = 0; i < Loader.invaders_boxes.length; i++) {
                if ( invader_box.position.distanceTo(Loader.invaders_boxes[i].position) < 250 &&
                     invader_box.position.x !== Loader.invaders_boxes[i].position.x) {
                  check = true;
                }
              }
              timer--;
          }
          invader_box.name = "invader";
          invader_box.visible = false;
          invader_box.rotation.y = Math.random()*Math.PI*2;
          scene.add( invader_box );
          Loader.invaders_boxes.push( invader_box );
      // Add model to the same position
      let invader_model = Loader.invader.model.clone();
          invader_model.position.y = invader_box.position.y;
          invader_model.position.x = invader_box.position.x;
          invader_model.position.z = invader_box.position.z;
          invader_model.rotation.y = invader_box.rotation.y;
          scene.add( invader_model );
          Loader.invaders_models.push( invader_model );
      // Add animations
      let invader_mixer = new THREE.AnimationMixer( invader_model );
				  invader_mixer.clipAction( Loader.invader.animations[ 0 ] ).play();
          invader_mixer.clipAction( Loader.invader.animations[ 1 ] ).play();
          invader_mixer.clipAction( Loader.invader.animations[ 2 ] ).play();
          Loader.invaders_mixers.push ( invader_mixer );
      // Add effect
      let invader_effect = Loader.light_effect.plane.clone();
          invader_effect.position.y = invader_box.position.y;
          invader_effect.position.x = invader_box.position.x;
          invader_effect.position.z = invader_box.position.z;
          Loader.invaders_effects.push(invader_effect);
          scene.add (invader_effect);
    }

    // Set up loaders for the next loading
    Loader.ground = {};
    Loader.ground.loader = new GLTFLoader();

    Loader.gun = {};
    Loader.gun.loader = new GLTFLoader();

    Loader.laser = {};
    Loader.laser.geometry = new THREE.BoxGeometry( 0.1, 0.1, 1000 );
    Loader.laser.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    Loader.laser.mesh    = new THREE.Mesh( Loader.laser.geometry, Loader.laser.material );
    Loader.laser.mesh.position.z = 4;
    Loader.laser.mesh.position.y = 0.5;

    Loader.text = {};
    Loader.text.loader = new FontLoader();

    Loader.sky = {};
    Loader.sky.loader = new RGBELoader();

    Loader.sound = {};
    Loader.sound.music = {};
    Loader.sound.music.audio = new THREE.Audio( listener );
    Loader.sound.music.loader = new THREE.AudioLoader();
    Loader.sound.effect = {};
    Loader.sound.effect.audio = new THREE.Audio( listener );
    Loader.sound.effect.loader = new THREE.AudioLoader();
    Loader.sound.win = {};
    Loader.sound.win.audio = new THREE.Audio( listener );
    Loader.sound.win.loader = new THREE.AudioLoader();
    Loader.sound.lose = {};
    Loader.sound.lose.audio = new THREE.Audio( listener );
    Loader.sound.lose.loader = new THREE.AudioLoader();

    Loader.light_effect = {};
    Loader.light_effect.loader = new THREE.TextureLoader();

    // Start loading the sky
    Loader.sky.loader.load( 'assets/mud_road_puresky_1k.hdr', function ( texture ) {

		  texture.mapping = THREE.EquirectangularReflectionMapping;

		  scene.background = texture;
		  scene.environment = texture;
		  Loader.sky.loaded = true; // Signal to create vr button in main.js

      // Load Ground
      Loader.ground.loader.load( 'assets/Castle/Castle_Building_Blocks/post-castle.glb', (gltf_ground)=> {
        scene.add(gltf_ground.scene);

        // Load Gun
        Loader.ground.loader.load( 'assets/Gun/Gun+.glb', (gltf_gun)=> {
          Loader.gun.model = gltf_gun.scene;
          Loader.gun.model.scale.x = 0.5;
          Loader.gun.model.scale.y = 0.5;
          Loader.gun.model.scale.z = 0.5;

          //Load invader
          Loader.invader.geometry = new THREE.BoxGeometry( 30, 30, 45 );
          Loader.invader.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
          Loader.invader.mesh     = new THREE.Mesh( Loader.invader.geometry, Loader.invader.material );

          Loader.invader.loader.load( 'assets/Invader/FGC_Skeleton+.glb', (gltf_invader)=> {
            Loader.invader.model = gltf_invader.scene;
            Loader.invader.animations = gltf_invader.animations;
				    Loader.invader.mixer = new THREE.AnimationMixer( Loader.invader.model );
				    Loader.invader.model.position.x = 0;
				    Loader.invader.model.position.y = 2;
				    Loader.invader.model.position.z = 0;
				    Loader.invader.model.scale.x = 15;
				    Loader.invader.model.scale.y = 15;
				    Loader.invader.model.scale.z = 15;

            // Load text
            Loader.text.loader.load( 'assets/PixelifySansMedium_Regular.json', function ( font ) {
	            Loader.text.geometry = new TextGeometry( 'LEVEL: 0', {
		            font: font,
		            size: 80,
		            bevelEnabled: false,
	            });
	            Loader.text.geometry.center();
	            Loader.text.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
              Loader.text.mesh     = new THREE.Mesh( Loader.text.geometry, Loader.text.material );
              Loader.text.mesh.position.z = 4;
              Loader.text.mesh.position.y = 0.5;
              Loader.text.mesh.scale.x = 0.005;
              Loader.text.mesh.scale.y = 0.005;
              Loader.text.mesh.scale.z = 0.0;

              // Load music
              Loader.sound.music.loader.load( 'assets/kbrecordzz__groove-metal-break-8.mp3', function( buffer ) {
	            Loader.sound.music.audio.setBuffer( buffer );
	            Loader.sound.music.audio.setLoop( true );

	            // Load sound effect
	            Loader.sound.effect.loader.load( 'assets/jobro__laser1.wav', function( buffer ) {
	              Loader.sound.effect.audio.setBuffer( buffer );

                // Load win sound
	              Loader.sound.win.loader.load( 'assets/littlerobotsoundfactory__jingle_win_synth_05.wav', function( buffer ) {
	                Loader.sound.win.audio.setBuffer( buffer );

                  // Load lose sound
	                Loader.sound.lose.loader.load( 'assets/suntemple__retro-you-lose-sfx.wav', function( buffer ) {
	                  Loader.sound.lose.audio.setBuffer( buffer );

                    // Load light effect
                    Loader.light_effect.loader.load ('assets/light.png' , function(texture) {
                      Loader.light_effect.geometry = new THREE.PlaneGeometry( 1, 1 );
                      Loader.light_effect.material = new THREE.MeshBasicMaterial( {
                        color: 0xffffff,
                        side: THREE.DoubleSide,
                        map: texture,
                        transparent: true,
                      });
                      Loader.light_effect.plane = new THREE.Mesh( Loader.light_effect.geometry, Loader.light_effect.material );
                      Loader.light_effect.plane.scale.x = 60;
                      Loader.light_effect.plane.scale.y = 60;
                      Loader.light_effect.plane.scale.z = 60;

                      // Add all to the scene
                      Loader.sound.music.audio.play();
                      scene.add(Loader.gun.model);
                      scene.add( Loader.laser.mesh );
                      scene.add( Loader.text.mesh );
                      Loader.loaded = true;
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

// Function to change the text when level changing
Loader.change_level = function (scene, level) {
  Loader.text.loader.load( 'assets/PixelifySansMedium_Regular.json', function ( font ) {
    scene.remove( Loader.text.mesh )
	  Loader.text.geometry = new TextGeometry( 'LEVEL: '+level, {
		  font: font,
		  size: 80,
		  bevelEnabled: false,
	  } );
	  Loader.text.geometry.center();
	  Loader.text.mesh     = new THREE.Mesh( Loader.text.geometry, Loader.text.material );
    Loader.text.mesh.position.z = 4;
    Loader.text.mesh.position.y = 0.5;
    Loader.text.mesh.scale.x = 0.005;
    Loader.text.mesh.scale.y = 0.005;
    Loader.text.mesh.scale.z = 0.0;
    scene.add( Loader.text.mesh );
  });
}

export default Loader;
