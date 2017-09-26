import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { LocationsProvider } from '../../providers/locations/locations';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  @ViewChild('map') mapElement: ElementRef;

  places: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMapsProvider, private platform: Platform, private locationsProvider: LocationsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.platform.ready().then(() => {
      let mapLoaded = this.googleMaps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      let locationsLoaded = this.locationsProvider.getPlacesList();

      Promise.all([mapLoaded, locationsLoaded]).then((result) => {

        let locs = result[1];

        for(let loc of locs) {
          this.googleMaps.addMarker(loc.acf.latitude, loc.acf.longitude, loc.title.rendered);
        }
      });
    });
  }

}
