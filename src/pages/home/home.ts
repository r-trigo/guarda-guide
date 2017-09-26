import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { AndroidPermissions } from '@ionic-native/android-permissions';

import { PlacesPage } from '../places/places';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private androidPermissions: AndroidPermissions, private platform: Platform) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
       if (this.platform.is('android')) {
         //this.askForLocationPermissions();
       }
    });
  }

  //abrir locais da categoria
  showPlaces(cat) {
     this.navCtrl.push(PlacesPage, { category:cat });
  }

  askForLocationPermissions() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION])
    );

  }

}
