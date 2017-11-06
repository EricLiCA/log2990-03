import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const trackRadius = 10;

@Injectable()
export class TerrainGenerationService {

    private track: Track;

    private scale: number;

    private textureSky: THREE.Texture;

    private decorElements: {object: THREE.Mesh, radius: number}[];

    constructor() {

    }

    public generate(scene: THREE.Scene, scale: number, track: Track, textureSky: THREE.Texture): void {
        this.track = track;
        this.scale = scale;
        this.textureSky = textureSky;

        this.addObjectsInScene(scene);
    }

    private addObjectsInScene(scene: THREE.Scene) {
        scene.add(this.generateTable());
        scene.add(this.generateRaceStartPlaid());

        this.generateIntersections().forEach(instersection => {
            scene.add(instersection);
        });

        this.generateSegments().forEach(instersection => {
            scene.add(instersection);
        });

        this.generateCones().then(cones => {
            cones.forEach(cone => {
                scene.add(cone);
            });
        });
    }

    private generateTable(): THREE.Mesh {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y));
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y));

        const tableMaterial = new THREE.MeshStandardMaterial ( {color: 0xF0F0F0, roughness: 0, metalness: 0, envMap: this.textureSky} );
        const tableGeometry = new THREE.PlaneGeometry(
            (this.scale * (maximumX - minimumX)) + (this.scale * trackRadius * 10),
            (this.scale * (maximumY - minimumY)) + (this.scale * trackRadius * 10),
            1,
            1
        );
        tableGeometry.rotateX(Math.PI / -2);
        const table = new THREE.Mesh(tableGeometry, tableMaterial);

        table.position.x = minimumX + ((maximumX - minimumX) / 2);
        table.position.z = minimumY + ((maximumY - minimumY) / 2);
        table.receiveShadow = true;
        return table;
    }

    private generateSegments(): THREE.Mesh[] {
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return this.track.trackIntersections.map((intersection, index, array) => {
            const fromPosition = intersection;
            const toPosition = array[index + 1 < array.length ? index + 1 : 0];

            const geometry = new THREE.PlaneGeometry(
                this.scale * this.getDistance(fromPosition, toPosition),
                this.scale * trackRadius * 2
            );
            geometry.rotateX(Math.PI / -2);

            const segmentMesh = new THREE.Mesh(geometry, material);

            segmentMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
            segmentMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
            segmentMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
            segmentMesh.position.y = 1;
            return segmentMesh;
        });
    }

    private getDistance(fromPosition: THREE.Vector2, toPosition: THREE.Vector2) {
        return Math.sqrt(Math.pow(fromPosition.x - toPosition.x, 2) + Math.pow(fromPosition.y - toPosition.y, 2));
    }

    private generateIntersections(): THREE.Mesh[] {
        const geometry = new THREE.CircleGeometry(this.scale * trackRadius, 32);
        geometry.rotateX(Math.PI / -2);
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return this.track.trackIntersections.map(intersection => {
            const intersectionMesh = new THREE.Mesh(geometry, material);
            intersectionMesh.position.x = intersection.x * this.scale;
            intersectionMesh.position.z = intersection.y * this.scale;
            intersectionMesh.position.y = 1;
            return intersectionMesh;
        });
    }

    private generateRaceStartPlaid(): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(this.scale * trackRadius * 2 / 20 * 3, this.scale * trackRadius * 2);
        geometry.rotateX(Math.PI / -2);
        const texture = THREE.ImageUtils.loadTexture('assets/plaid_start_v2.jpg');
        const material = new THREE.MeshStandardMaterial({map: texture, metalness: 0, roughness: 0, envMap: this.textureSky});
        const plaidMesh = new THREE.Mesh(geometry, material);

        const fromPosition = this.track.trackIntersections[0];
        const toPosition = this.track.trackIntersections[1];
        plaidMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
        plaidMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
        plaidMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
        plaidMesh.position.y = 2;

        return plaidMesh;
    }

    private generateCones(): Promise<THREE.Mesh[]> {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y));
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y));

        const service = this;
        const loaderPromise = new Promise<THREE.Mesh[]>(function(resolve, reject) {
            function loadDone(cone) {
                cone.scale.set(20 * service.scale, 20 * service.scale, 20 * service.scale);
                const cones: THREE.Mesh[] = [];
                for (let i = 0; i < 10; i++) {
                    const newCone = <THREE.Mesh> cone.clone();
                    newCone.rotateY(Math.random() * Math.PI);
                    newCone.position.x = service.scale * ((Math.random() * (Math.abs(maximumX) + Math.abs(minimumX))) + minimumX);
                    newCone.position.z = service.scale * ((Math.random() * (Math.abs(maximumY) + Math.abs(minimumY))) + minimumY);
                    cones.push(newCone);
                }
                resolve(cones);
            }

            new THREE.ObjectLoader().load('/assets/cone.json', loadDone);
        });

        return loaderPromise;
    }

    private availableRadius(point: THREE.Vector2): number {
        const minimumDistanceToTrack = Math.min.apply(null, this.track.trackIntersections.map( (intersection, index, array) => {
            const line = {point1: intersection, point2: array[index + 1 === array.length ? 0 : index + 1]};
            return this.distanceFromPointToLine(point, line) - trackRadius;
        }));

        const minimumDistanceToObject = Math.min.apply(null, this.decorElements.map( element => {
            return this.distance(
                new THREE.Vector2(
                    element.object.position.x / this.scale,
                    element.object.position.z / this.scale
                ), point
            ) - element.radius;
        }));

        return Math.min(minimumDistanceToObject, minimumDistanceToTrack);
    }

    private distanceFromPointToLine(point, line): number {
        const optimalPoint = this.getNearestPointOnLine(point, line);

        if (
            Math.min(line.point1.x, line.point2.x) <= optimalPoint.x &&
            Math.max(line.point1.x, line.point2.x) >= optimalPoint.x
        ) {
            return this.distance(point, optimalPoint);
        } else {
            return Math.min(this.distance(point, line.point1), this.distance(point, line.point2));
        }
    }

    public distance(point1: { x: number, y: number }, point2: { x: number, y: number }): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    private getNearestPointOnLine(point, line) {
        const lineParameters = this.getLineParameters(line);
        const permenticularParameters = {
            a: lineParameters.b,
            b: -lineParameters.a,
            c: -((lineParameters.b * point.x) + (-lineParameters.a * point.y))
        };

        return this.twoLineIntersection(lineParameters, permenticularParameters);
    }

    private getLineParameters(line): { a: number, b: number, c: number } {
        const a = line.point1.y - line.point2.y;
        const b = line.point2.x - line.point1.x;
        const c = (line.point1.x * line.point2.y) - (line.point2.x * line.point1.y);
        return { a, b, c };
    }

    private twoLineIntersection(line1, line2): { x: number, y: number } {
        if (line1.a === 0) {
            const x = ((line1.c * line2.b) - (line1.b * line2.c)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return { x, y: this.solveLineEquationWithX(x, line1) };
        } else {
            const y = ((line1.a * line2.c) - (line1.c * line2.a)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return { x: this.solveLineEquationWithY(y, line1), y };
        }
    }

    private solveLineEquationWithX(x, lineParameters): number {
        return ((lineParameters.a * x) + lineParameters.c) / -lineParameters.b;
    }

    private solveLineEquationWithY(y, lineParameters): number {
        return ((lineParameters.b * y) + lineParameters.c) / -lineParameters.a;
    }
}
