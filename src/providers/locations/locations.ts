import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationsProvider {

  api_url='http://localhost:8080/bo1/wp-json/wp/v2/';
  //api_url='http://superpi.sytes.net/wp-json/wp/v2/';
  places: any;
  public usersLocation: any;

  constructor(public http: Http, private geolocation: Geolocation) {
    console.log('Hello LocationsProvider Provider');
  }

  getPlacesList() {
    if(this.places) {
      return Promise.resolve(this.places);
    }

    return new Promise(resolve => {
      this.http.get(this.api_url + 'posts?per_page=15').map(res => res.json()).subscribe(places => {
        this.geolocation.getCurrentPosition().then((position) => {

          let usersLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          console.log(usersLocation);

          //para passar como parâmetro do navCtrl
          this.usersLocation = usersLocation;

          this.places = this.applyHaversine(places, usersLocation);
          this.places.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });

          resolve(this.places);
        });
      });
    });
  }
 
  applyHaversine(places, usersLocation){
    for(let p of places) {
      let placeLocation = {
        lat: p.acf.latitude,
        lng: p.acf.longitude
      };
      p.distance = this.getDistanceBetweenPoints(usersLocation, placeLocation, 'km').toFixed(2);
      p.timeto = p.distance * 8.333333333;
    };
    return places;
  }
 
  getDistanceBetweenPoints(start, end, units){
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;
 
    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
 
    return d;
  }
 
  toRad(x){
    return x * Math.PI / 180;
  }

}
