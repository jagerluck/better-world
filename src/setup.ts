import L from 'leaflet';
import { setupMapLegend } from './controllers';
import { Store } from './store/store';
import regions from './ukraine_geojson';
import { onEachFeature } from './handlers';
import { getColor } from './helpers';
import { defaultFeatureStyle } from './consts';
import { RedPin } from './assets';

// initialize map
const store = new Store();

export const initialize = () => {
  const map = Store.map;

  // map settings
  // Satelite Layer
  const googleSatellite = L.tileLayer(
    'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );
  // Open Street
  const osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
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
    GoogleMap: googleStreets,
    OpenStreetMap: osm,
    Satellite: googleSatellite,
  };
  googleStreets.addTo(map);
  osm.addTo(map);
  googleSatellite.addTo(map);
  L.control.layers(baseLayers).addTo(map);

  setupMapLegend();

  L.geoJSON(regions, {
    style: (feature) => {
      return {
        fillColor: getColor(),
        ...defaultFeatureStyle,
      };
    },
    onEachFeature,
  }).addTo(map);

  const rIcon = L.icon({
    iconUrl: RedPin,
    iconSize: [16, 16], // should vary
    // TODO: more mods
  });

  L.marker([49, 33], { icon: rIcon })
    .addTo(map)
    .addEventListener('click', (e) => {
      store.displayPinData(100); // TODO: API
    });
};
