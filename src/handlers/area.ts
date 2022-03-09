import L from 'leaflet';

type HandleMarkerClick = {
  e: L.LeafletMouseEventHandlerFn;
  map: L.Map;
};

export const handleAreaClick = ({ e, map }: HandleMarkerClick) => {
};
