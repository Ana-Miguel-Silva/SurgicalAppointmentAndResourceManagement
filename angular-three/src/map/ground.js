import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  size: Vector2
 * }
 */

export default class Ground {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        const texture = new THREE.TextureLoader().load("textures/ground.jpg");
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(4,4);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff  , map: texture  });
        this.object = new THREE.Mesh(geometry, material);
        this.object.rotation.x = -Math.PI / 2.0;
        this.object.castShadow = false;
        this.object.receiveShadow =true;
    }
}