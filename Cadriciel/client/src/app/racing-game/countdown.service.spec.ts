import { Track } from './track';
import { ControllerFactory } from './controller-factory.service';
import { VehicleService } from './vehicle.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { CommandsService } from './events/commands.service';
import { RaceEventService } from './events/race-event.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { RacingSceneService } from './racing-scene.service';
import { TestBed } from '@angular/core/testing';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import * as THREE from 'three';

let countdownService: CountdownService;

describe('CountdownService', function () {
    const track = new Track(
        'name',
        'desc',
        'diff',
        [new THREE.Vector2(0, 100), new THREE.Vector2(0, 0), new THREE.Vector2(100, 0)],
        [],
        [],
        [],
        -1,
        0,
        []
    );

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [AudioService,
                CommandsService,
                CountdownDecreaseEventService,
                RacingSceneService,
                VehicleService,
                CountdownService,
                RaceEventService,
                LoadingProgressEventService,
                ControllerFactory,
                VehicleMoveEventService,
                VehicleRotateEventService]
        });
        countdownService = TestBed.get(CountdownService);
    });

    it('construction test', () => {
        expect(countdownService).toBeDefined();
        expect(countdownService['count'] === 6);
        expect(countdownService.countdownEnded === false);
        expect(countdownService.countdownStarted === false);
    });

    it('starts countdown', () => {
        countdownService.startCountdown();
        expect(countdownService['count'] !== 6);
    });

    it('starts game', () => {
        countdownService.startGame();
        expect(countdownService.countdownEnded === true);
    });
});
