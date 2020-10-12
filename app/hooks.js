const {useState} = require('react');

export function useLocation(initValue) {
  const [geoInfo, setGeoInfo] = useState(initValue);

  const useCallLocation = () => setGeoInfo(geoInfo);
  console.log(geoInfo);
  return [geoInfo, useCallLocation];
}
