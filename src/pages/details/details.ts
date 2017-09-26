import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform } from 'ionic-angular';

import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NativeStorage } from '@ionic-native/native-storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { PolylineProvider } from '../../providers/polyline/polyline';

/**
 * Generated class for the DetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  place: any;
  latitude: number;
  longitude: number;
  timeto: number;
  icon: string;
  staticMapLink: string;
  usersLocation: any;
  polyline: any;
  fav_places: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private launchNavigator: LaunchNavigator, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private polylineProvider: PolylineProvider, private nativeStorage: NativeStorage, private androidPermissions: AndroidPermissions, private platform: Platform) {
    this.place = navParams.get('place_data');
    this.usersLocation = navParams.get('usersLocation');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
    this.fav_places = this.getFav_places();

    this.latitude = this.place.acf.latitude;
    this.longitude = this.place.acf.latitude;
    this.timeto = Math.round(this.place.timeto);

    this.setMapCardIcon(this.place.categories[0]);
    this.setStaticMapLink(this.place);

  }

  navigate() {
    this.launchNavigator.navigate([this.latitude, this.longitude]).then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

  //visitar mais tarde
  visitarMaisTarde() {
    this.platform.ready().then(() => {
       if (this.platform.is('android')) {
         //this.askForStoragePermissions();
       }
    });

    this.addFav_place(this.place);
    this.presentToast(this.place.title.rendered);
  }

  addFav_place(p) {
    this.nativeStorage.setItem('fav_places', {place: p}).then(
      () => console.log('Stored favorite place!'),
      error => console.error('Error storing favorite place', error)
    );
  }

  getFav_places() {
    this.nativeStorage.getItem('fav_places').then(
      data => console.log(data),
      error => console.error(error)
    );
  }

  askForStoragePermissions(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.EXTERNAL_STORAGE).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.INTERNAL_STORAGE])
    );

  }

  presentToast(place_name) {
    let toast = this.toastCtrl.create({
      message: place_name + ' assinalado para visitar',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Notificação dispensada');
    });

    toast.present();
  }

  setMapCardIcon(category) {
    switch(category) {
      case 2:
        this.icon = 'camera';
        break;
      case 5:
        this.icon = 'tennisball';
        break;
      case 6:
        this.icon = 'moon';
        break;
      case 7:
        this.icon = 'restaurant';
        break;
      case 8:
        this.icon = 'cafe';
        break;
    }
  }

  setStaticMapLink(place) {
    let pLat = this.usersLocation.lat;
    let pLng = this.usersLocation.lng;
    let cLat = this.place.acf.latitude;
    let cLng = this.place.acf.longitude;

    this.staticMapLink = 'https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=250x220&'
      + 'markers=color:blue|label:P|'+ pLat + ',' + pLng + '&markers=color:green|label:C|' + cLat + ',' + cLng;

    console.log(this.staticMapLink);

    this.loadPolyline(pLat, pLng, cLat, cLng);
  }

  //progress dialog
  loadPolyline(pLat, pLng, cLat, cLng) {
    var loading = this.loadingCtrl.create({
      content: 'A obter detalhes...'
    });

    loading.present();

    this.polylineProvider.getPolylineFor(pLat, pLng, cLat, cLng).then(polyline => {
      this.polyline = polyline;
      this.staticMapLink = this.staticMapLink + '&path=weight:3%7Ccolor:red%7Cenc:' + this.polyline;
      console.log(this.staticMapLink);
      loading.dismiss();
    });
  }

}
