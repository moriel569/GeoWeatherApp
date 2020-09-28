import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

export default function HomeScreen() {
  const [geoData, setGeoData] = useState({});
  const {height, width} = Dimensions.get('window');
  useGetAndStoreCurrentLocation();

  function useGetAndStoreCurrentLocation() {
    return useEffect(() => {
      getAndStoreCurrentLocation();
    }, []);
  }

  function getAndStoreCurrentLocation() {
    getLocationPermission()
      .then(() => {
        return getCurrentPosition();
      })
      .then((data) => {
        let {
          coords: {latitude, longitude},
        } = data;
        return getWeatherDataByLatLng(latitude, longitude);
      })
      .then((info) => {
        const geoDataToStore = {
          longitude: info.coord.lon,
          latitude: info.coord.lat,
          date: info.dt,
          country: info.sys.country,
          city: info.name,
          weather: info.weather[0].description,
          icon: info.weather[0].icon,
          temperature: info.main.temp,
          loaded: true,
        };

        setGeoData(geoDataToStore);
        return storeWeatherData(geoDataToStore);
      })
      .catch((err) => console.log(err));
  }

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

  async function getWeatherDataByLatLng(lat, lon) {
    const APPID = '7461936da212f6a73296e33719a25f45';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APPID}`,
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

  const storeWeatherData = async (weatherData) => {
    try {
      // console.log(weatherData);
      const jsonWeatherData = JSON.stringify(weatherData);
      const storageKey = JSON.stringify(weatherData.date);
      // AsyncStorage.getAllKeys().then((keyArray) => {
      //   AsyncStorage.multiGet(keyArray).then((keyValArray) => {
      //     let myStorage: any = {};
      //     for (let keyVal of keyValArray) {
      //       myStorage[keyVal[0]] = JSON.parse(keyVal[1]);
      //     }

      //     console.log('CURRENT STORAGE: ', myStorage);
      //   });
      // });
      console.log('Data saved to storage');

      return AsyncStorage.setItem(storageKey, jsonWeatherData);
    } catch (e) {
      console.log(e);
    }
  };

  return geoData.loaded === true ? (
    <ScrollView style={{flex: 1, backgroundColor: '#7453ec'}}>
      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 5,
          borderColor: 'green',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, color: '#fff', fontWeight: '700'}}>
          Weather Today
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          marginVertical: 20,
          alignItems: 'center',
        }}>
        <Icon name="location" color={'#cbec53'} size={75} />
        <Text style={styles.text}>Latitude: {geoData.latitude}</Text>
        <Text style={styles.text}>Longitude: {geoData.longitude}</Text>
        <Text style={styles.text}>
          City: {geoData.country}, {geoData.city}
        </Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <Image
          style={{width: 120, height: 120}}
          source={{
            uri: `http://openweathermap.org/img/wn/${geoData.icon}@4x.png`,
          }}
        />
        <Text style={styles.text}>{geoData.weather}</Text>
        <Text style={styles.text}>
          {(geoData.temperature - 273.15).toFixed(1)} ℃
        </Text>
      </View>
    </ScrollView>
  ) : (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height, width}}>
      <ActivityIndicator size="large" color="#7453ec" />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {fontSize: 25, marginVertical: 3, color: '#fff'},
});
