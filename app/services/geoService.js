import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const APPID = '7461936da212f6a73296e33719a25f45';

export function getLocationPermission() {
  return new Promise((resolve, reject) => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
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

export function getWeatherByCoords(lat, lon) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APPID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((response) => response.json())
    .then((weatherInfo) => {
      return weatherInfo;
    });
}
