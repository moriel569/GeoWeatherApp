import {useEffect, useState} from 'react';
import {
  getItems,
  saveItems,
  removeItemByKey,
} from '../services/asyncStorageService';
import {
  getLocationPermission,
  getWeatherDataByLatLng,
  getCurrentPosition,
} from '../services/geoService';

export function useCurrentGeoPosition(isEnabled) {
  const [geoData, setGeoData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  function getAndStoreCurrentLocation() {
    if (!isEnabled) {
      return;
    }

    getLocationPermission()
      .then(() => {
        return getCurrentPosition();
      })
      .then((recievedCoords) => {
        let {
          coords: {latitude, longitude},
        } = recievedCoords;
        return getWeatherDataByLatLng(latitude, longitude);
      })
      .then((weatherData) => {
        const geoDataToStore = {
          longitude: weatherData.coord.lon,
          latitude: weatherData.coord.lat,
          date: weatherData.dt,
          country: weatherData.sys.country,
          city: weatherData.name,
          weather: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          temperature: weatherData.main.temp,
        };

        setGeoData(geoDataToStore);
        setIsLoaded(true);
        return saveItems(geoDataToStore);
      })
      .catch((error) => console.log(error));
  }

  useEffect(getAndStoreCurrentLocation, []);

  return {
    isLoaded,
    geoData,
  };
}

export function useStoredGeoData() {
  const [storedData, setStoredData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItems()
      .then((data) => setStoredData(data))
      .catch((error) => setError(error));
  }, []);

  const removeItem = (key) => {
    removeItemByKey(key);
    setStoredData((storedItems) => {
      return storedItems.filter((item) => {
        return item.date.toString() !== key;
      });
    });
  };

  return {
    data: storedData,
    error,
    removeItem,
  };
}
