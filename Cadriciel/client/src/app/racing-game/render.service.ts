import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';

@Injectable()
export class RenderService {

    private container: HTMLElement;

    private stats: Stats;

    private cube: THREE.Mesh;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    public rotationSpeedY = 0.01;

    constructor(private cameraService: CameraService, private terrainGeneration: TerrainGenerationService) {
    }

    private animateCube() {
        this.cube.rotation.y += this.rotationSpeedY;
        // this.cube.position.z += 5;
    }

    private createCube() {
        const geometry = new THREE.BoxGeometry(100, 100, 100);

        for (let i = 0; i < geometry.faces.length; i += 2) {
            const hex = Math.random() * 0xffffff;
            geometry.faces[i].color.setHex(hex);
            geometry.faces[i + 1].color.setHex(hex);
        }

        const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    private createScene(track: Track) {
        this.scene = new THREE.Scene();
        this.createSkyBox();
        this.createCube();
        this.terrainGeneration.generate(this.scene, track);
        this.cameraService.initializeCameras(this.container, this.cube, 100);
    }

    public createSkyBox() {
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        const textureSky = THREE.ImageUtils.loadTextureCube(images);
        const shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = textureSky;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        const skyboxMesh    = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000), material );
        material.needsUpdate = true;
        this.scene.add( skyboxMesh );
    }

    public eventsList(event: any): void {
        this.cameraService.swapCamera(event);
        this.cameraService.zoomCamera(event);
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
        this.animateCube();
        this.cameraService.cameraOnMoveWithObject();
        this.renderer.render(this.scene, this.cameraService.getCamera());
        this.stats.update();
    }

    private initStats() {
        this.stats = new Stats();
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '64px';
        this.container.appendChild(this.stats.dom);
    }

    public onResize() {
        const aspectRatio = this.container.clientWidth / this.container.clientHeight;
        this.cameraService.onResize(aspectRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public initialize(container: HTMLElement, rotationX: number, rotationY: number, track: Track) {
        this.container = container;
        this.rotationSpeedY = rotationY;
        this.createScene(track);
        this.initStats();
        this.startRenderingLoop();
    }
}
