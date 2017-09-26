import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PolylineProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PolylineProvider {

  polyline: any;
  api_url: string;

  constructor(public http: Http) {
    console.log('Hello PolylineProvider Provider');
  }

  getPolylineFor(pLat, pLng, cLat, cLng) {
    this.buildURL(pLat, pLng, cLat, cLng);
    console.log(this.api_url);
    return new Promise(resolve => {
      this.http.get(this.api_url).map(res => res.json()).subscribe(polyline => {
        this.polyline = polyline.routes[0].overview_polyline.points;
        resolve(this.polyline);
      });
    });
  }

  buildURL(pLat, pLng, cLat, cLng) {
    this.api_url = 'https://maps.googleapis.com/maps/api/directions/json?origin='
    + pLat + ',' + pLng + '&destination=' + cLat + ',' + cLng;
  }

}
