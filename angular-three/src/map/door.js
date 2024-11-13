import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class Decor {
    constructor(parameters, onLoadCallback) {
        this.url = parameters.url;
        this.scale = parameters.scale || 1;
        this.object = null;
        this.loaded = false;

        // GLTF model loading
        const loader = new GLTFLoader();
        loader.load(
            this.url,
            (gltf) => {
                this.object = gltf.scene;
                this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
                this.setShadow(this.object);
                this.loaded = true;
                
                // Invoke the callback to indicate the model is ready
                if (onLoadCallback) onLoadCallback(this.object);
            },
            (xhr) => console.log(`Resource '${this.url}' ${(100.0 * xhr.loaded / xhr.total).toFixed(0)}% loaded.`),
            (error) => console.error(`Error loading resource ${this.url}:`, error)
        );
    }

    setShadow(object) {
        object.traverse((child) => {
            if (child instanceof THREE.Object3D) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
}