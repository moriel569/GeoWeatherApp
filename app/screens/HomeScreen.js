import React, {useContext} from 'react';
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

// UTILS
import {kelvinToCelsius} from '../utils/temperatureUtils';

// FUNCTIONS
import {useCurrentGeoPosition} from '../hooks/useGeoData';
import {createWeatherIconUri} from '../services/geoService';
import {ThemeContext} from '../theme';

export default function HomeScreen({route, navigation}) {
  const historyData = route?.params?.geoData;
  const {geoData, isLoaded} = useCurrentGeoPosition(!historyData);
  const geoDataToRender = historyData ? historyData : geoData;
  const {height, width} = Dimensions.get('window');
  const theme = useContext(ThemeContext);

  if (!isLoaded) {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', height, width}}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.viewContainer, {backgroundColor: theme.primary}]}>
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
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Home',
                  params: {someParam: 'AnyParam'},
                },
              ],
            })
          }
          buttonStyle={styles.checkLocationButtonContainer}
          titleStyle={styles.checkLocationButtonTitle}
          linearGradientProps={styles.checkLocationButtonGradient}
          // iconContainerStyle={styles.iconContainerStyle}
          icon={<Icon name="location" color={theme.accent} size={25} />}
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
            uri: createWeatherIconUri(geoDataToRender.icon),
          }}
        />
        <Text style={styles.text}>{geoDataToRender.weather}</Text>
        <Text style={styles.text}>
          {kelvinToCelsius(geoDataToRender.temperature)} ℃
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {flex: 1},
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
