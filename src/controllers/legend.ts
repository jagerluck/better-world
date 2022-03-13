import L from 'leaflet';
import { legendId } from '../consts';
import { getColor } from '../helpers';

export function setupMapLegend() {
  const legendInfo = L.DomUtil.create('div', 'legend-info');

  let div = L.DomUtil.create('div', 'legend-info__unit'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000], // TODO: API
    html = [],
    from,
    to;

  html.push('<h3>Lorem</h3>');

  for (let i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    html.push(
      `<p style="line-height: 1.6rem; font-size: 0.9rem; margin: 0;"><span style="margin-right: .5rem; padding: 0.75rem; background: ${getColor(
        from + 1
      )}"></span>${to ? `${from} - ${to}` : `${from} +`}</p>`
    );
  }
  div.innerHTML = html.join('');
  legendInfo.appendChild(div);

  const legend = L.DomUtil.get(legendId);
  legend?.appendChild(legendInfo);
}
