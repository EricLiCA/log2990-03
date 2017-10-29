import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CrosswordRoutingModule } from './crossword-routing.module';

import { KeyboardService } from './keyboard.service';
import { LexiconService } from './lexicon.service';
import { CrosswordService } from './crossword.service';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordGridService } from './crossword-grid.service';
import { CrosswordHintsService } from './crossword-hints.service';
import { CrosswordPointsService } from './crossword-points.service';

import { CrosswordMenuComponent } from './crossword-menu.component';
import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordHintsComponent } from './crossword-hints.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        CrosswordRoutingModule
    ],
    declarations: [
        CrosswordMenuComponent,
        CrosswordGameComponent,
        CrosswordHintsComponent
    ],
    exports: [

    ],
    providers: [
        KeyboardService,
        LexiconService,
        CrosswordService,
        CrosswordGridService,
        CrosswordGameService,
        CrosswordHintsService,
        CrosswordPointsService
    ]
})
export class CrosswordModule { }
