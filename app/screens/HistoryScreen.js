import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export const storeWeather = async (weatherData) => {
  try {
    const jsonWeatherData = JSON.stringify(weatherData);
    await AsyncStorage.setItem(
      JSON.stringify(weatherData.date),
      jsonWeatherData,
    );
    console.log('Throw Data to Cache');
    return jsonWeatherData != null ? JSON.parse(weatherData) : null;
  } catch (e) {
    console.log(e);
  }
};

const HistoryScreen = () => {
  const [storeData, setSoreData] = useState([]);
  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = async () => {
    try {
      const jsonWeatherData = await AsyncStorage.getItem('@storage_Key');
      jsonWeatherData === undefined
        ? console.log('No Cached Data')
        : console.log('Get Data from Cache');
      const recievedData = JSON.parse(jsonWeatherData);
      return recievedData != null ? setSoreData([{recievedData}]) : null;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={storeData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default HistoryScreen;
