import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    if (child.material instanceof THREE.Material) {
                        child.material.needsUpdate = true;
                    }
                    else if (child.material instanceof Array) {
                        child.material.forEach(element => {
                            if (element instanceof THREE.Material) {
                                element.needsUpdate = true;
                            }
                        });
                    }
                }
            });
        }


        // Create the graphical user interface

        // Create the lights folder
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.hide();
        }
        else {
            this.gui.hide();
        }
    }
}