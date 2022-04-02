import L from 'leaflet';
import { PinSlider } from '../components';
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

  async displayPinData(id: number) {
    if (this.state.pins[id]) {
      return this.state.pins[id]; 
    }

    // TODO: substitute mock
    new PinSlider({
      data: [{  }],
      map: Store.map,
      afterImg: 'https://i.stack.imgur.com/ipp4N.png',
      baseImg:
        'https://i.pinimg.com/originals/ea/69/dc/ea69dc6226e72a33f82d3add20b470df.jpg',
      line: true,
      lineColor: '#333',
    });

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
