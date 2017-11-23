import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { LineCalculationService } from './line-calculation.service';
import { CollisionDetectionService } from './collision-detection.service';
import { RaceService } from './race.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { ObstacleService } from './obstacle.service';
import { CommandsService } from './events/commands.service';
import { Track } from './track';
import { VehicleService } from './vehicle.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import { RoadLimitService } from './road-limit.service';

let vehicleService: VehicleService;
const track = new Track('name', 'description', 'type', [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 0),
    new THREE.Vector2(100, 100)
], [], [], [], -1, 0, []);

describe('VehicleService', () => {
    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                VehicleService,
                CommandsService,
                ObstacleService,
                CountdownService,
                AudioService,
                RaceService,
                CollisionDetectionService,
                RoadLimitService,
                LineCalculationService,
                VehicleMoveEventService,
                VehicleMovementController,
                VehicleRotateEventService,
                LoadingProgressEventService
            ]
        });
        vehicleService = TestBed.get(VehicleService);
    });

    it('should be created', () => {
        expect(vehicleService).toBeTruthy();
    });

    it('Should initialize main 3D vehicle', (done) => {
        vehicleService.initializeMainVehicle(track, 1).then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it('Should initialize opponents 3D vehicles(3)', (done) => {
        vehicleService.initializeOpponentsVehicles(track, 1).then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

});

