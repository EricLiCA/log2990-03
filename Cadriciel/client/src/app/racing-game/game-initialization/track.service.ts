import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const apiUrl = 'http://localhost:3000/api';
@Injectable()
export class TrackService {
    constructor(private http: Http) { }

    public deleteTrack(trackName: string): Promise<string> {
        const path = 'track';
        return this.http
            .delete(`${apiUrl}/${path}/${trackName}`
        ).toPromise()
        .then(response => response.json().data)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

