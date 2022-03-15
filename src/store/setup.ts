import L from 'leaflet';
import { setupMapLegend } from '../controllers';
import { Store } from './store';
import regions from '../ukraine_geojson';
import { handleMarkerClick, onEachFeature } from '../handlers';
import { getColor } from '../helpers';
import { defaultFeatureStyle } from '../consts';

// initialize map
new Store();

export const initialize = () => {
  const map = Store.map;

  // map settings
  // Open Street
  const osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }
  );
  // Satelite Layer
  const googleSatellite = L.tileLayer(
    'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );
  // Google Streets
  const googleStreets = L.tileLayer(
    'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );
  const baseLayers = {
    Satellite: googleSatellite,
    GoogleMap: googleStreets,
    OpenStreetMap: osm,
  };
  googleStreets.addTo(map);
  googleSatellite.addTo(map);
  osm.addTo(map);
  L.control.layers(baseLayers).addTo(map);

  setupMapLegend();

  L.geoJSON(regions, {
    style: (feature) => {
      console.log(feature);
      return {
        fillColor: getColor(),
        ...defaultFeatureStyle,
      };
    },
    onEachFeature,
  }).addTo(map);

  L.marker([49, 33]).addTo(map).addEventListener('click', handleMarkerClick);

  map.on('click', (e: any) => {
    console.log(e);
  });
};
