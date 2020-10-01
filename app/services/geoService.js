import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const APPID = '7461936da212f6a73296e33719a25f45';

export const getCurrentPosition = async function (
  geo_success: Function,
  geo_error?: Function,
  geo_options?: GeoOptions,
) {
  invariant(
    typeof geo_success === 'function',
    'Must provide a valid geo_success callback.',
  );
  let hasPermission = true;
  // Supports Android's new permission model. For Android older devices,
  // it's always on.
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (!hasPermission) {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      hasPermission = status === PermissionsAndroid.RESULTS.GRANTED;
      // the patch:
      if (!hasPermission) {
        geo_error({code: PERMISSION_DENIED_ERROR_CODE});
      }
    }
  }
  if (hasPermission) {
    RCTLocationObserver.getCurrentPosition(
      geo_options || {},
      geo_success,
      geo_error || logError,
    );
  }
};

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
