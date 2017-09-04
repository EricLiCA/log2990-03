import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CubeComponent } from './home/cube/cube.component';

import {RenderService} from './home/cube/render.service';
import {BasicService} from './basic.service';
import { HomeComponent } from './home/home.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { CrosswordGameComponent } from './crossword-game/crossword-game.component';


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    HomeComponent,
    RacingGameComponent,
    CrosswordGameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    RenderService,
    BasicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
