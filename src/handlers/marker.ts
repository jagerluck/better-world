import { Store } from '../store/store';

export const handleMarkerClick = (e: any) => {
  new Store().getById(100); // TODO: get id of a pin

  // L.popup({ autoClose: true, autoPan: true })
  //   .setLatLng(e.latlng)
  //   .setContent(slider)
  //   .openOn(Store.map);
};
