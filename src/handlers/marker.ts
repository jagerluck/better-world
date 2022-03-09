import L from 'leaflet';

export const handleMarkerClick = (e: L.LeafletMouseEvent) => {
  console.log(e);
  console.log(L.bounds);
  // L.popup
  //   .setLatLng(e.latlng)
  //   .setContent('You clicked the map at ' + e.latlng.toString())
  //   .openOn(L.map('map'));
};
