import L from 'leaflet';
import { Store } from '../store/store';

export const handleMarkerClick = (e: L.LeafletMouseEvent) => {
  const id = 0; // TODO
  const store = new Store();
  const loadedPin = store.getById(id);
  const slider = document.getElementById('slider');
  console.log(slider);

  const div = document.createElement('div');
  Object.assign(div, {
    className: 'popup',
    height: 200,
    width: 360,
    style: `background: red; padding: 2rem;`,
    innerHTML: 'some long text',
    onclick: function () {
      console.log('clicked', this);
      // @ts-ignore
      this.style.backgroundColor = this.style.backgroundColor === 'red' ? 'blue' : 'red';
    },
  });

  console.log(div.attributes, 'DIV');

  L.popup({ autoClose: true, autoPan: true })
    .setLatLng(e.latlng)
    .setContent('You clicked the map at ' + e.latlng)
    .openOn(Store.map);
};
