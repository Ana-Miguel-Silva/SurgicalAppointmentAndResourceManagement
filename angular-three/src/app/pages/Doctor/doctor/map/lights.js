import * as THREE from "three";
//import { GUI } from "three/addons/libs/lil-gui.module.min.js";


/*
 * parameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, distance: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, distance: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, distance: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float }
 * }
 */

export default class Lights {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the ambient light
        this.object.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

        this.object.add(this.object.ambientLight);

        // Create directional light

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);

        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

        light.position.set(1, 20, 5); 
        //light.target.position.set(0, 0, 0); 
        light.target.updateMatrixWorld(); 


        light.castShadow = true;
        floorMaterial.receiveShadow = true;

        light.shadow.camera.near = 1;
        light.shadow.camera.far = 100;

        this.object.directionalLight = light; 
        this.object.add(light);
        this.object.add(light.target);





        // Create the first point light and set its position in the scene
       /*    
        this.object.pointLight1 = new THREE.PointLight(this.pointLight1.color, this.pointLight1.intensity, this.pointLight1.distance);
        this.object.pointLight1.position.set(this.pointLight1.position.x, this.pointLight1.position.y, this.pointLight1.position.z);
        //Turn on shadows for this light and set its properties

        this.object.pointLight1.shadow.mapSize.height = 512;
        this.object.pointLight1.shadow.mapSize.width = 512;
        this.object.pointLight1.shadow.camera.near = 5.0;
        this.object.pointLight1.shadow.camera.far = 15.0;

        this.object.add(this.object.pointLight1); 


        // Create the second point light and set its position in the scene
        this.object.pointLight2 = new THREE.PointLight(this.pointLight2.color, this.pointLight2.intensity, this.pointLight2.distance);
        this.object.pointLight2.position.set(this.pointLight2.position.x, this.pointLight2.position.y, this.pointLight2.position.z);


        /// Turn on shadows for this light and set its properties:
           
        this.object.pointLight2.castShadow = true;

        this.object.pointLight2.shadow.mapSize.height = 512;
        this.object.pointLight2.shadow.mapSize.width = 512;
        this.object.pointLight2.shadow.camera.near = 5.0;
        this.object.pointLight2.shadow.camera.far = 15.0;

        // Add this light to the scene
        this.object.add(this.object.pointLight2); */
    }
}