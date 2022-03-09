export const getColor = (v: number) => {
  return v > 1000
    ? '#800026'
    : v > 500
    ? '#BD0026'
    : v > 200
    ? '#E31A1C'
    : v > 100
    ? '#FC4E2A'
    : v > 50
    ? '#FD8D3C'
    : v > 20
    ? '#FEB24C'
    : v > 10
    ? '#FED976'
    : '#FFEDA0';
};
