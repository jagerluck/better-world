import L from 'leaflet';
import { defaultFeatureStyle } from '../consts';
import { getColor } from '../helpers';
import { Store } from '../store/store';

const highlightFeatureStyle = {
  weight: 3,
  color: '#f0ff28',
  dashArray: '',
  fillOpacity: 0.6,
};

export const featureStyle = {
  fillColor: getColor(), // TODO: feature?.properties.damageDone API call
 ...defaultFeatureStyle,
};

export const zoomToFeature = (e: any) => {
  const map = Store.map;

  map.fitBounds(e.target.getBounds());
};

const highlightFeature = (e: L.LeafletMouseEvent) => {
  const feature = e.target;
  feature.setStyle(highlightFeatureStyle);
  if (!L.Browser.ie && !L.Browser.opera) {
    feature.bringToFront();
  }
};

const resetHighlight = (e: L.LeafletMouseEvent) => {
  const feature = e.target;
  feature.setStyle(featureStyle);
};

export const onEachFeature = (feature: any, layer: any) => {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
};
