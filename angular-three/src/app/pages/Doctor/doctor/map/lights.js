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

        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; 
        floor.receiveShadow = true;

        // Create directional light

        const color = 0xFFFFFF;
        const intensity = 0;
        const light = new THREE.DirectionalLight(color, intensity);       

        light.position.set(-1, -1, 20); 
        light.target.position.set(0, 0, 0); 
        light.target.updateMatrixWorld(); 


        light.castShadow = true;
        floorMaterial.receiveShadow = true;

        light.shadow.camera.near = 1;
        light.shadow.camera.far = 100;

        this.object.directionalLight = light; 
        this.object.add(light);
        this.object.add(light.target);


        const color2 = 0xFFFFFF;
        const intensity2 = 1;
        const light2 = new THREE.DirectionalLight(color2, intensity2);

        const floorMaterial2 = new THREE.MeshStandardMaterial({ color2: 0x888888 });

        light2.position.set(-5, 17, 10); 
        light2.target.position.set(0, 0, 0);
        light2.target.updateMatrixWorld(); 

        light2.castShadow = true;
        floorMaterial2.receiveShadow = true;

        light2.shadow.camera.near = 1;
        light2.shadow.camera.far = 100;

        this.object.directionalLight = light2; 
        this.object.add(light2);
        this.object.add(light2.target);


    }



}