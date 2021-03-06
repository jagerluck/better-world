import L from 'leaflet';
import { PinSlider } from '../components';
import { mapId } from '../consts';
// import rawRegions from '../ukraine_geojson';

export class Store {
  state: Record<string, any> = { pins: [] };
  // regions: {};
  static map: L.Map;

  constructor() {
    if (!Store.map) {
      // entry point for the map
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
      data: [
        {
          type: 'comparison',
          baseImage: 'https://i.stack.imgur.com/ipp4N.png',
          afterImage:
            'https://i.pinimg.com/originals/ea/69/dc/ea69dc6226e72a33f82d3add20b470df.jpg',
        },
        {
          type: 'image',
          baseImage:
            'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80',
        },
        {
          type: 'video',
          video:
            'https://lamberta.github.io/html5-animation/examples/ch04/assets/movieclip.mp4',
        },
      ],
      map: Store.map,
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
