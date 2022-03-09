import L from 'leaflet';
import { mapId } from './consts';
// import { baseLayers } from './layers/layers';
import './controllers';
import { setupMapLegend } from './controllers';
import './css/style.scss';
import { handleMarkerClick } from './handlers';
import regions from './ukraine_geojson_old';

const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Create the Leaflet map with a generic start point
export const map = L.map(mapId, {
  center: [49, 33],
  zoom: 6,
  scrollWheelZoom: true,
  zoomControl: true,
  tap: false,
});

L.tileLayer(tileUrl, {
  maxZoom: 19,
  attribution,
  tileSize: 512,
}).addTo(map);

L.marker([49, 33]).addTo(map); // add Pin to the map
L.tileLayer(tileUrl, { attribution }).addTo(map);

// additional
setupMapLegend();
L.geoJSON(regions.Dnipropetrovsk).addTo(map);

map.on('click', handleMarkerClick);
