export const getColor = (v?: number) => {
  const color = !v ? Math.random() * 500 : v;

  return color > 1000
    ? 'rgb(8, 0, 80)'
    : color > 500
    ? 'rgb(11, 0, 114)'
    : color > 200
    ? 'rgb(72, 54, 236)'
    : color > 100
    ? 'rgb(83, 64, 253)'
    : color > 50
    ? 'rgb(92, 116, 255)'
    : color > 20
    ? 'rgb(131, 150, 255)'
    : color > 10
    ? 'rgb(164, 155, 252)'
    : 'rgb(179, 170, 255)';
};
