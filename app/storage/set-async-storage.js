import AsyncStorage from '@react-native-community/async-storage';

export const storeWeatherData = async (weatherData) => {
  try {
    const jsonWeatherData = JSON.stringify(weatherData);
    const storageKey = JSON.stringify(weatherData.date);

    console.log('Data saved to storage');

    return AsyncStorage.setItem(storageKey, jsonWeatherData);
  } catch (e) {
    console.log(e);
  }
};
