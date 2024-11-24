import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class Wall {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        const texture = new THREE.TextureLoader().load("assets/textures/wall.jpg");
        texture.colorSpace = THREE.SRGBColorSpace;

        texture.magFilter = THREE.LinearFilter;

        this.object = new THREE.Group();
        let geometry = new THREE.PlaneGeometry(1.0, 2.5);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff , map: texture });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, 1.25, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        face.position.set(0.0, 1.25, -0.025);
        this.object.add(face);
        let points = new Float32Array([
            -0.475, 0.0, 0.025,
            -0.475, 2.5, 0.025,
            0.0, 2.5, 0.0,
            0.0, 0.0, 0.0,

            0.0, 2.5, 0.0,
            -0.475, 2.5, -0.025,
            -0.475, 0.0, -0.025,
            0.0, 0.0, 0.0
        ]);
        let normals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
        let indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        material = new THREE.MeshPhongMaterial({ color: 0x6b554b });
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        face = new THREE.Mesh().copy(face, false);
        face.rotation.y = Math.PI;
        this.object.add(face);

        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, material); 
        points = new Float32Array([
            -0.475, 2.5, -0.025,
            0.0  , 2.5,  0.0  ,
            -0.475, 2.5,  0.025,
             0.475, 2.5,  0.025,
             0.5  , 2.5,  0.0  ,
             0.475, 2.5, -0.025,
        ]);
        normals = new Float32Array([
            1, 1, 1,
            1, 1, 1,
            1, 1, 1,
            1, 1, 1,
            1, 1, 1,
            1, 1, 1,
        ]);
        indices = [
            0, 1, 2,
            0, 2, 3,
            3, 4, 5,
            3, 5, 0
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);
    }
}