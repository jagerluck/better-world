import L from 'leaflet';
import './css/style.scss';

const attribution =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Create the Leaflet map with a generic start point
export const map = L.map('map', {
  center: [49, 33],
  zoom: 6,
  scrollWheelZoom: true,
  zoomControl: true,
  tap: false,
});

L.tileLayer(tileUrl, {
  maxZoom: 19,
  attribution,
}).addTo(map);

L.marker([49, 33]).addTo(map); // add Pin to the map
L.tileLayer(tileUrl, { attribution }).addTo(map);