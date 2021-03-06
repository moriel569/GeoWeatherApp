import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import Config from 'react-native-config';

export function getLocationPermission() {
  return new Promise((resolve, reject) => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            resolve('The permission is granted');
            break;
          case RESULTS.UNAVAILABLE:
            reject(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            reject(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.BLOCKED:
            reject('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition((data) => resolve(data));
  });
}

export async function getWeatherDataByLatLng(lat, lon) {
  const TOKEN = Config.OPEN_WEATHER_MAP_TOKEN;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${TOKEN}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const weatherInfo = await response.json();
  return weatherInfo;
}

export function createWeatherIconUri(icon) {
  return `http://openweathermap.org/img/wn/${icon}@4x.png`;
}
