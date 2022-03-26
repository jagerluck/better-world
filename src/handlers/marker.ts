import { Store } from '../store/store';

/* 
steps when open Pin:
  - keep id of the pin, mb through data attr;
  - check store for pin data by it's id, if none - call API;
  - open popup slider with scrollable video or photo
*/

export const handleMarkerClick = (e: any) => {
  new Store().getById(100);

  // const div = document.createElement('div');
  // Object.assign(div, {
  //   className: 'popup',
  //   height: 200,
  //   width: 360,
  //   style: `background: red; padding: 2rem;`,
  //   innerHTML: 'some long text',
  //   onclick: function () {
  //     console.log('clicked', this);
  //     // @ts-ignore
  //     this.style.backgroundColor = this.style.backgroundColor === 'red' ? 'blue' : 'red';
  //   },
  // });

  // L.popup({ autoClose: true, autoPan: true })
  //   .setLatLng(e.latlng)
  //   .setContent(slider)
  //   .openOn(Store.map);
};
