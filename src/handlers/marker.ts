import L from 'leaflet';
import { Store } from '../store/store';

export const handleMarkerClick = (e: L.LeafletMouseEvent) => {
  console.log(e);
  L.popup({ autoClose: true, autoPan: true })
    .setLatLng(e.latlng)
    .setContent('You clicked the map at ' + e.latlng)
    .openOn(Store.map);
};
