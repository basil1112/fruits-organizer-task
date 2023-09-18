/**
 * @author [basil]
 * 
 */

import * as THREE from "three";

// Class that extends THREE.Mesh to create a circle
export class CircleMesh extends THREE.Mesh {
    constructor(radius: number, color: number) {
        const circleGeometry = new THREE.CircleGeometry(radius, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color });
        super(circleGeometry, circleMaterial);
    }
}