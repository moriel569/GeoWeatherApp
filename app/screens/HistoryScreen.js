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
import {TabActions} from '@react-navigation/native';
import {fetchAllStoredItems} from '../storage/async-storage-service';

import Item from '../components/Item';

export default function HistoryScreen({navigation}) {
  const {height, width} = Dimensions.get('window');
  const [storedData, setStoredData] = useState([]);
  const [error, setError] = useState(null);
  setAndExtractStoredData();

  function setAndExtractStoredData() {
    return useEffect(() => {
      fetchAndSetItems();
    }, []);
  }

  async function fetchAndSetItems() {
    try {
      const getStoredInfo = await fetchAllStoredItems().then(
        (extractedData) => extractedData,
      );
      setStoredData(getStoredInfo);
    } catch (e) {
      setError(e);
    }
  }

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
