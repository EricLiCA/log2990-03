import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class DrawTrackService {
    private container: HTMLElement;

    private camera: THREE.OrthographicCamera;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    private cameraZ = 400;

    private mousePosition: THREE.Vector3;

    public pointX;

    public pointY;

    public updateMousePosition(clientX: number, clientY: number) {
        this.mousePosition.x = clientX - this.container.clientWidth/2 - this.container.offsetLeft;
        this.mousePosition.y = this.container.clientHeight/2 + this.container.offsetTop - clientY;
    }

    public addPoint() {
        let geometry = new THREE.CircleGeometry( 10, 32 );
        let material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
        let circle = new THREE.Mesh( geometry, material );
        circle.position.set(this.mousePosition.x, this.mousePosition.y, this.mousePosition.z);
        this.scene.add( circle );
    }

    private createScene() {
        /* Scene */
        this.scene = new THREE.Scene();

        /* Camera */
        this.camera = new THREE.OrthographicCamera(
            this.container.clientWidth / - 2,
            this.container.clientWidth / 2,
            this.container.clientHeight / 2,
            this.container.clientHeight / - 2,
            1,
            1000
        );
        this.camera.position.z = this.cameraZ;
    }

    private startRenderingLoop() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    public onResize() {
        this.camera.left = this.container.clientWidth / -2;
        this.camera.right = this.container.clientWidth / 2;
        this.camera.top = this.container.clientHeight / 2;
        this.camera.bottom = this.container.clientHeight / - 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public initialise(container: HTMLElement, positionX: number, positionY: number) {
        this.container = container;
        this.pointX = positionX;
        this.pointY = positionY;
        this.mousePosition = new THREE.Vector3();
        this.createScene();
        this.startRenderingLoop();
    }
}
