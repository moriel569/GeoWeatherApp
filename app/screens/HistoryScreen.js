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

        setStoredData(items);
      } catch (error) {
        console.log(error, 'problemo');
      }
    };
    fetchAllItems();
  }, []);

  const renderItem = (item) => {
    console.log(item);
    const date = new Date(Number(item.item[0]) * 1000);
    return <Item style={styles.text} title={item.item[0]} />;
  };

  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  console.log(storedData);

  return storedData ? (
    <SafeAreaView style={styles.container}>
      <Text>Location History</Text>
      <FlatList
        data={storedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
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
    fontSize: 20,
    color: '#fff',
  },
});
