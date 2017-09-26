import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';

import { LocationsProvider } from '../../providers/locations/locations';
import { DetailsPage } from '../details/details';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

/**
 * Generated class for the PlacesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {

  places:any;
  noFilter: any;
  hasFilter: boolean = false;
  searchTerm: any;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private locationsProvider: LocationsProvider, private loadingCtrl: LoadingController, private actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController, private launchNavigator: LaunchNavigator) {
    this.category = navParams.get('category');
    this.loadPlacesData();
    this.presentToast();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
  }

  //abir detalhes do monumento
  itemTapped(place) {
    this.navCtrl.push(DetailsPage, { place_data:place, usersLocation:this.locationsProvider.usersLocation });
  }

  //progress dialog
  loadPlacesData() {
    var loading = this.loadingCtrl.create({
      content: 'A pesquisar locais...'
    });

    loading.present();

    this.locationsProvider.getPlacesList().then(places => {
      this.places = places;
      this.noFilter = this.places;
      if(this.category) {
        this.filterByCat(this.category);
      }
      loading.dismiss();
    });
  }

  searchItems() {
    this.places = this.places.filter((place) => {
      return place.title.rendered.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  showFilters() :void {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Filter options:',
      buttons: [
        {
          text: 'Monumentos', handler: () => {
            this.places = this.noFilter.filter((item) => item.categories[0] === 2);
            this.hasFilter = true;
          }
        },
        {
          text: 'Lazer', handler: () => {
            this.places = this.noFilter.filter((item) => item.categories[0] === 5);
            this.hasFilter = true;
          }
        },
        {
          text: 'Restauração', handler: () => {
            this.places = this.noFilter.filter((item) => item.categories[0] === 7);
            this.hasFilter = true;
          }
        },
        {
          text: 'Alojamento', handler: () => {
            this.places = this.noFilter.filter((item) => item.categories[0] === 6);
            this.hasFilter = true;
          }
        },
        {
          text: 'Bares', handler: () => {
            this.places = this.noFilter.filter((item) => item.categories[0] === 8);
            this.hasFilter = true;
          }
        },
        {
          text: 'Cancelar', role: 'cancel', handler: () => {
            this.places = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });
    actionSheet.present();
  }

  filterByCat(cat) :void {
    this.places = this.noFilter.filter((item) => item.categories[0] === cat);
    this.hasFilter = true;
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Toque no botão laranja para iniciar roteiro!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  startRoute() {
    let total = '';
    // launchnavigator.navigate('waypoint1+to:waypoint2+to:waypoint3', {start: 'some place'});
    for (let p of this.places) {
        total += p.acf.latitude + ',' + p.acf.longitude + '+to:';
    }
    total = total.substr(0, total.length-4);
    let usersLocation = this.locationsProvider.usersLocation;
    console.log(total);

    this.launchNavigator.navigate(total, {start: [usersLocation.lat, usersLocation.lng]}).then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

}
