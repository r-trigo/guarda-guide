import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { PlacesPage } from '../places/places';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PlacesPage;
  tab3Root = MapPage;

  constructor() {

  }
}
