import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default function HistoryScreen() {
  const {height, width} = Dimensions.get('window');
  const [storedData, setStoredData] = useState([]);

  useEffect(() => {
    // AsyncStorage.getAllKeys().then((keys) =>
    //   AsyncStorage.multiGet(keys).then((data) =>
    //     data.forEach((data) => {
    //       setStoredData(data);
    //       return console.log(storedData);
    //     }),
    //   ),
    // );

    const fetchAllItems = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);

        const putDataToState = () =>
          items.forEach((item) =>
            setStoredData([...storedData, JSON.parse(item[1])]),
          );
        putDataToState();

        //  console.log(storedData);
        // setStoredData(jsonToObject);
        // return console.log(storedData);
        // AsyncStorage.getAllKeys((err, keys) => {
        //   AsyncStorage.multiGet(keys, (error, stores) => {
        //     stores.map((result, i, store) => {
        //       console.log({[store[i][0]]: store[i][1]});
        //       return true;
        //     });
        //   });
        // });
      } catch (error) {
        console.log(error, 'problemo');
      }
    };
    fetchAllItems();
  }, []);

  const renderItem = (item) => {
    console.log(item);
    const date = new Date(Number(item.item.date) * 1000).toLocaleString(
      'ru-RU',
    );
    return (
      <Item
        style={styles.text}
        title={date}
        lat={item.item.latitude}
        lng={item.item.longitude}
        city={item.item.city}
      />
    );
  };

  const Item = ({title, lat, lng, city}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.coords}>
        Lat: {lat} Lng: {lng} {city}
      </Text>
    </View>
  );

  return storedData ? (
    <SafeAreaView style={styles.container}>
      <Text style={styles.historyTitle}>Location History</Text>
      <FlatList
        data={storedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  ) : (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height, width}}>
      <ActivityIndicator size="large" color="#7453ec" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#7453ec',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 13,
  },
  title: {
    fontSize: 17,
    color: '#fff',
  },
  coords: {
    fontSize: 14,
    color: '#fff',
  },
  historyTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#7453ec',
    paddingHorizontal: 20,
  },
});
