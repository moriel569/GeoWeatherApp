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
import formatRelative from 'date-fns/formatRelative';
import Icon from 'react-native-vector-icons/Ionicons';
// FUNCTIONS
import {storeWeatherData} from '../storage/async-storage-service';
import {getLocationPermission} from '../services/geoService';
import {getCurrentPosition} from '../services/geoService';
import {getWeatherDataByLatLng} from '../services/geoService';

const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(1);

export default function HomeScreen({route}) {
  const [geoData, setGeoData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const geoDataToRender = route?.params?.geoData
    ? route.params.geoData
    : geoData;

  const {height, width} = Dimensions.get('window');

  useGetAndStoreCurrentLocation();

  function useGetAndStoreCurrentLocation() {
    return useEffect(() => {
      if (!route?.params?.geoData) {
        getAndStoreCurrentLocation();
      }
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
        };

        setGeoData(geoDataToStore);
        setIsLoaded(true);
        return storeWeatherData(geoDataToStore);
      })
      .catch((err) => console.log(err));
  }

  return isLoaded ? (
    <ScrollView style={{flex: 1, backgroundColor: '#7453ec'}}>
      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 5,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 30,
            color: '#fff',
            fontWeight: '700',
            textAlign: 'center',
          }}>
          Weather {'\n'}
          {formatRelative(geoDataToRender.date * 1000, new Date())}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          marginVertical: 20,
          alignItems: 'center',
        }}>
        <Icon name="location" color={'#cbec53'} size={75} />
        <Text style={styles.text}>Latitude: {geoDataToRender.latitude}</Text>
        <Text style={styles.text}>Longitude: {geoDataToRender.longitude}</Text>
        <Text style={styles.text}>
          City: {geoDataToRender.country}, {geoDataToRender.city}
        </Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <Image
          style={{width: 120, height: 120}}
          source={{
            uri: `http://openweathermap.org/img/wn/${geoDataToRender.icon}@4x.png`,
          }}
        />
        <Text style={styles.text}>{geoDataToRender.weather}</Text>
        <Text style={styles.text}>
          {kelvinToCelsius(geoDataToRender.temperature)} ℃
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
