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
  TouchableOpacity,
} from 'react-native';
import {TabActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default function HistoryScreen({navigation}) {
  const {height, width} = Dimensions.get('window');
  const [storedData, setStoredData] = useState([]);

  // console.log(navigation);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const geoDataItems = await AsyncStorage.multiGet(keys);
        // console.log(geoDataItems);
        const itemsToRender = geoDataItems
          .map((geoDataItem) => JSON.parse(geoDataItem[1]))
          .sort((a, b) => b.date - a.date);

        return setStoredData(itemsToRender);
      } catch (error) {
        console.log(error, 'problemo');
      }
    };
    fetchAllItems();
  }, []);

  const renderItem = ({item}) => {
    const date = new Date(Number(item.date) * 1000).toLocaleString('ru-RU');
    const jumpToAction = TabActions.jumpTo('Home', {geoData: item});
    return (
      <Item
        onPress={() => navigation.dispatch(jumpToAction)}
        style={styles.text}
        title={date}
        lat={item.latitude}
        lng={item.longitude}
        city={item.city}
      />
    );
  };

  const Item = ({title, lat, lng, city, onPress}) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.coords}>
            Lat: {lat} Lng: {lng} {city}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
