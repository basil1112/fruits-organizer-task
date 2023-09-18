/**
 * @author [basil]
 * 
 */

import * as THREE from "three";

// Class that extends THREE.Mesh to create a rectangle

export class RectangleMesh extends THREE.Mesh {
    constructor(width: number, height: number, color: number) {
        const rectGeometry = new THREE.BoxGeometry(width, height, 0);
        const rectMaterial = new THREE.MeshBasicMaterial({ color });
        super(rectGeometry, rectMaterial);
    }


}

