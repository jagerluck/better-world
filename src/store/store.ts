import L from 'leaflet';
import { mapId } from '../consts';
// import rawRegions from '../ukraine_geojson';

export class Store {
  state: Record<string, any> = {};
  // regions: {};
  static map: L.Map;

  constructor() {
    // Create the Leaflet map with a generic start point
    if (!Store.map) {
      Store.map = L.map(mapId, {
        center: [49, 33],
        zoom: 6,
        scrollWheelZoom: true,
        zoomControl: true,
        tap: false,
      });
    }
  }
}
