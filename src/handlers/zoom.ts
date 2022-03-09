import L from 'leaflet';

type ZoomToEvent = {
  e: L.ZoomAnimEvent;
  map: L.Map;
};

export const zoomToEvent = ({ e, map }: ZoomToEvent) => {
  console.log(e.propagatedFrom);
};
