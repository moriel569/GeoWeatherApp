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
import {Button} from 'react-native-elements';
// import LinearGradient from 'react-native-linear-gradient';

// FUNCTIONS
import {storeWeatherData} from '../storage/asyncStorageService';
import {getLocationPermission} from '../services/geoService';
import {getCurrentPosition} from '../services/geoService';
import {getWeatherDataByLatLng} from '../services/geoService';
import {useLocation} from '../hooks';

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
      {/* TOP CONTAINER */}

      <View style={styles.innerContainer}>
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

      {/* BUTTON */}

      <View style={styles.innerContainer}>
        <Button
          onPress={() => {}}
          buttonStyle={styles.checkLocationButtonContainer}
          titleStyle={styles.checkLocationButtonTitle}
          linearGradientProps={styles.checkLocationButtonGradient}
          // iconContainerStyle={styles.iconContainerStyle}
          icon={<Icon name="location" color={'#cbec53'} size={25} />}
          iconLeft
          raised
          title="Check Location"
        />

        {/* COORDS */}

        <View style={styles.innerContainer}>
          <Text style={styles.text}>Latitude: {geoDataToRender.latitude}</Text>
          <Text style={styles.text}>
            Longitude: {geoDataToRender.longitude}
          </Text>
          <Text style={styles.text}>
            City: {geoDataToRender.country}, {geoDataToRender.city}
          </Text>
        </View>
      </View>

      <View style={{alignItems: 'center'}}>
        <Image
          style={{width: 100, height: 100}}
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
  innerContainer: {
    justifyContent: 'center',
    marginVertical: 13,
    alignItems: 'center',
  },
  checkLocationButtonContainer: {
    minWidth: 30,
    minHeight: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#7453ea',
    margin: 2,
  },
  checkLocationButtonTitle: {
    fontSize: 20,
  },
  // iconContainerStyle: {
  //   flex: 1,
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  // },
});
