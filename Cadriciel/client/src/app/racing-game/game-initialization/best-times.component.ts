import { Component, OnInit } from '@angular/core';
import { TrackService } from './track.service';
import { Track } from './../track';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-best-times',
  templateUrl: './best-times.component.html',
  styleUrls: ['./best-times.component.css']
})
export class BestTimesComponent implements OnInit {

  public track: Track;
  public bestTimesDisplayed: boolean;

  constructor(
      private route: ActivatedRoute,
      private trackService: TrackService
  ) { }

  public getRoute() {
      return this.route;
  }

  public ngOnInit() {
      const trackName = this.route.snapshot.params['name'];
      this.trackService.get(trackName).then(track => {
          this.track = track;
      });

      this.route.params.subscribe(params => {
          this.trackService.get(params.name).then(track => this.track = track);
      });
  }


}
