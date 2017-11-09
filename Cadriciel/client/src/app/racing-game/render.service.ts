import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { CommandsService } from './commands.service';
import { Subscription } from 'rxjs/Subscription';
import { VehicleService } from './vehicle.service';

@Injectable()
export class RenderService {

    private scale: number;

    public container: HTMLElement;

    private stats: Stats;

    private renderer: THREE.WebGLRenderer;

    public scene: THREE.Scene;

    private textureSky: THREE.Texture;

    private subscription: Subscription;

    private event: any;

    private keyPressed = false;

    constructor(
        private cameraService: CameraService,
        private terrainGenerationService: TerrainGenerationService,
        private commandsService: CommandsService,
        private vehicule: VehicleService
    ) {
        this.subscription = this.commandsService.getKeyDownEvent()
        .subscribe(event => {
            this.event = event;
            this.keyPressed = true;
        });
    }

    public animateVehicule() {
        this.vehicule.engineVehicle();
    }

    private createScene() {
        this.scene = new THREE.Scene();
        this.createSkyBox();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.4));
        const dirLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        dirLight.position.set( 200, 500, 100 );
        dirLight.rotation.y = Math.PI / 4 ;
        dirLight.rotation.x = Math.PI / 4 ;
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 1000;
        dirLight.shadow.camera.right = 1000;
        dirLight.shadow.camera.left = - 1000;
        dirLight.shadow.camera.top	= 1000;
        dirLight.shadow.camera.bottom = - 1000;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add( dirLight );
    }

    public createSkyBox() {
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        this.textureSky = THREE.ImageUtils.loadTextureCube(images);
        const shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = this.textureSky;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), material);
        material.needsUpdate = true;
        this.scene.add(skyboxMesh);
    }

    public loadTrack(track) {
        this.terrainGenerationService.generate(this.scene, this.scale, track, this.textureSky);
    }

    public eventsList(): void {
        if (this.keyPressed) {
            this.cameraService.swapCamera(this.event);
            this.cameraService.zoomCamera(this.event);
            this.keyPressed = false;
        }
    }

    public startRenderingLoop() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.cameraService.cameraOnMoveWithObject();
        this.renderer.render(this.scene, this.cameraService.getCamera());
        this.eventsList();
        this.animateVehicule();
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

    public async initialize(container: HTMLElement, track: Track, scale: number): Promise<void> {
        this.scale = scale;
        this.container = container;
        this.createScene();
        this.initStats();
        this.loadTrack(track);
    }

}
