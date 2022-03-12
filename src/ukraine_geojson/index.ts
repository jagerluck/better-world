import regionsRaw from './ukraine_regions.json';

const regions: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
}

Object.assign(regions, regionsRaw);

export default regions;