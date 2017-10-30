import { TrackService } from './../racing-game/game-initialization/track.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-view-tracks-component',
    templateUrl: './admin-view-tracks.component.html',
    styleUrls: ['./admin-view-tracks.component.css']
})
export class AdminViewTracksComponent implements OnInit {

    public trackName: string;
    public trackJustDeleted = false;

    constructor(private route: ActivatedRoute, private trackService: TrackService) { }

    public getRoute() {
        return this.route;
    }

    public ngOnInit(): void {
    }

    public onActivate(event) {
        setTimeout(() => { // To respect the unidirectional data flow rule
            this.trackName = event.getRoute().snapshot.params['name'];
            event.getRoute().params.subscribe( params => this.trackName = params.name );
        }, 0);
    }

    public onDeactivate(event) {
        if (!this.trackJustDeleted) {
            this.trackName = undefined;
        }
    }

    public async delete(): Promise<boolean> {
        this.trackJustDeleted = true;
        let response = false;
        await this.trackService.deleteTrack(this.trackName).then(res => {
            response = (res !== 'connectionError');
            this.trackName = undefined;
            this.trackJustDeleted = false;
        });
        return response;
    }
}
