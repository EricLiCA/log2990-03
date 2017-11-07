import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as THREE from 'three';

@Injectable()
export class CountdownService {
    private audio: HTMLAudioElement;
    public countdown: THREE.Mesh;
    private font: THREE.Font;
    private count: number;

    constructor() {
        this.audio = new Audio('../../assets/countdown.mp3');
        this.audio.load();
        this.count = 6;
    }

    public startCountdown(countdown: Observable<number>, count: number): Observable<number> {
        console.log(this);
        this.startAudio();
        countdown = Observable.timer(0, 1000)
            .take(this.count)
            .map(() => --this.count);
        countdown.subscribe(x => {
            this.updateCountdown(x);
        });
        return countdown;
    }

    private startAudio() {
        this.audio.play();
    }

    public async createCountdown(): Promise<void> {
        await this.create3DCountdown();
        console.log(this.font);
        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async create3DCountdown(): Promise<THREE.Mesh> {
        const loader = new THREE.FontLoader();
        let textGeometry: THREE.TextGeometry;
        return new Promise<THREE.Mesh>(resolve => {
            loader.load('../../assets/font_samuel_regular.json', function(font) {
                this.font = font;
                console.log('font: ', this.font);
                textGeometry = new THREE.TextGeometry((this.count - 1).toString(), {
                    font: font,
                    size: 50,
                    height: 0,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 1
                });
                const material = new THREE.MeshPhongMaterial({
                    color: 0xffff00
                });
                this.countdown = new THREE.Mesh(textGeometry, material);
                this.countdown.position.setX(-165);
                this.countdown.position.setY(165);
                this.countdown.position.setZ(250);
                console.log(this.countdown);
                resolve(this.countdown);
            }.bind(this));
        });
    }

    private updateCountdown(count: number) {
        console.log('countdown updated to: ', count);
        const countText = count.toString();
        console.log(this.font);
        const textGeometry = new THREE.TextGeometry(countText, {
                    font: this.font,
                    size: 50,
                    height: 0,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 1
        });
        console.log(textGeometry);
        const material = new THREE.MeshPhongMaterial({
                    color: 0xffff00
        });
        this.countdown.geometry = textGeometry;
        //this.countdown = new THREE.Mesh(textGeometry, material);
        this.countdown.position.setX(-165);
        this.countdown.position.setY(165);
        this.countdown.position.setZ(250);
    }
}
