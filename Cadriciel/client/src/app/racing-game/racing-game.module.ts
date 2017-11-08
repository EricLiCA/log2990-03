import { DecorElementsService } from './decor-elements.service';
import { CountdownService } from './countdown.service';
import { TerrainGenerationService } from './terrain-generation.service';
import { RacingGameRoutingModule } from './racing-game-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GameInitializationModule } from './game-initialization/game-initialization.module';

import { RacingGameComponent } from './racing-game.component';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TrackService } from './game-initialization/track.service';
import { RacingGameService } from './racing-game.service';
import { CommandsService } from './commands.service';
import { VehicleService } from './vehicle.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpModule,
        GameInitializationModule,
        RacingGameRoutingModule
    ],
    declarations: [
        RacingGameComponent,
    ],
    exports: [
        RacingGameComponent,
    ],
    providers: [
        RenderService,
        CameraService,
        TrackService,
        RacingGameService,
        TerrainGenerationService,
        CommandsService,
        VehicleService,
        CountdownService,
        DecorElementsService
    ]
})
export class RacingGameModule { }
