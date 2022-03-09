import L from 'leaflet';
import { legendId } from '../consts';
import { getColor } from '../helpers';

export function setupMapLegend() {
  const legendInfo = L.DomUtil.create('div', 'legend-info');

  let div = L.DomUtil.create('div', 'legend-info__unit'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000], // TODO: API
    labels = [],
    from,
    to;

  for (let i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      `<div className="legend-info__box"><p style="background: ${getColor(
        from + 1
      )}">${to ? `${from} - ${to}` : `${from} +`}</p></div>`
    );
  }
  div.innerHTML = labels.join('');
  legendInfo.appendChild(div);

  const legend = L.DomUtil.get(legendId);
  legend?.appendChild(legendInfo);
}
