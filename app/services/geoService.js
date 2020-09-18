import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const TOKEN = 'pk.8630a6bc93caccd54ac89336b48ded7b';

function getLocationPermission() {
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

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition((data) => resolve(data));
  });
}

function getAddressByLatAndLong(lat, lng) {
  return fetch(
    `https://eu1.locationiq.com/v1/reverse.php?key=${TOKEN}&lat=${lat}&lon=${lng}&format=json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function geoService() {
  getLocationPermission()
    .then(() => {
      return getCurrentPosition();
    })
    .then((data) => {
      let {
        coords: {latitude, longitude},
      } = data;
      return getAddressByLatAndLong(latitude, longitude);
    })
    .catch((err) => console.log(err));
}

export default geoService;
