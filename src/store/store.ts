import L from 'leaflet';
import { mapId } from '../consts';
// import rawRegions from '../ukraine_geojson';

export class Store {
  state: Record<string, any> = { pins: [] };
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

  async getById(id: number) {
    if (this.state.pins[id]) {
      return this.state.pins[id]; 
    }
    return;
    // try {
    //   const pin = await fetch(`${process.env.API}/${id}`);
    //   this.state.pins[id] = pin;
      
    //   return pin;
    // } catch(err) {
    //   console.error(err);
    // }
  }
}
