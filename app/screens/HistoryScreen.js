import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default function HistoryScreen() {
  const [storedData, setStoredData] = useState([]);

  useEffect(() => {
    logCurrentStorage();
  }, []);

  // const getWeather = async () => {
  //   try {
  //     const getWeatherData = await AsyncStorage.getItem('@storage_Key');
  //     getWeatherData === undefined
  //       ? console.log('No Cached Data')
  //       : console.log('Get Data from Cache');
  //     const recievedData = JSON.parse(getWeatherData);
  //     return recievedData != null ? setStoredData([{recievedData}]) : null;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const getWeather = async () => {
  //   try {
  //     AsyncStorage.getAllKeys().then((keyArray) => {
  //       AsyncStorage.multiGet(keyArray).then((keyValArray) => {
  //         let myStorage: any = {};
  //         for (let keyVal of keyValArray) {
  //           myStorage[keyVal[0]] = keyVal[1];
  //         }
  //         const recievedData = JSON.parse(myStorage);
  //         console.log('CURRENT STORAGE: ', myStorage);
  //         return recievedData != null ? setStoredData({recievedData}) : null;
  //       });
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  async function logCurrentStorage() {
    AsyncStorage.getAllKeys().then((keyArray) => {
      AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        let myStorage: any = {};
        for (let keyVal of keyValArray) {
          myStorage[keyVal[0]] = keyVal[1];
        }
        // const recievedData = JSON.parse(myStorage);
        console.log('CURRENT STORAGE: ', myStorage);
      });
    });
  }

  // const renderItem = ({item}) => <Item title={item} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* <FlatList
        data={storedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
});
