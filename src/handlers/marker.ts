import L from 'leaflet';
import { Store } from '../store/store';

export const handleMarkerClick = (e: L.LeafletMouseEvent) => {
  const map = Store.map;

  console.log(e);

  map.fitBounds(e.target.latlng);

  // L.popup
  //   .setLatLng(e.latlng)
  //   .setContent('You clicked the map at ' + e.latlng.toString())
  //   .openOn(L.map('map'));
};
