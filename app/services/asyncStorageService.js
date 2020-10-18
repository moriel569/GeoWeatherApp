import AsyncStorage from '@react-native-community/async-storage';

export const saveItems = async (weatherData) => {
  try {
    const jsonWeatherData = JSON.stringify(weatherData);
    const storageKey = JSON.stringify(weatherData.date);

    console.log('Data saved to storage');

    return AsyncStorage.setItem(storageKey, jsonWeatherData);
  } catch (e) {
    console.log(e);
  }
};

export const getItems = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const geoDataItems = await AsyncStorage.multiGet(keys);
    const itemsToRender = geoDataItems
      .map((geoDataItem) => JSON.parse(geoDataItem[1]))
      .sort((a, b) => b.date - a.date);

    return itemsToRender;
  } catch (error) {
    console.log(error, 'Error');
  }
};

export const removeItemByKey = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};
