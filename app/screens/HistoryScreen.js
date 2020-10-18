import React, {useContext} from 'react';
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

import WeatherHistoryItem from './WeatherHistoryItem';
import {useStoredGeoData} from '../hooks/useGeoData';
import {ThemeContext} from '../theme';

export default function HistoryScreen({navigation}) {
  const {height, width} = Dimensions.get('window');
  const theme = useContext(ThemeContext);
  const {data: storedData, error, removeItem} = useStoredGeoData();

  const renderItem = ({item, index}) => {
    const date = new Date(Number(item.date) * 1000).toLocaleString('ru-RU');
    const jumpToAction = TabActions.jumpTo('Home', {geoData: item});

    return (
      <WeatherHistoryItem
        onPress={() => navigation.dispatch(jumpToAction)}
        removeItem={() => removeItem(item.date.toString())}
        style={styles.text}
        title={date}
        lat={item.latitude}
        lng={item.longitude}
        city={item.city}
        index={index}
      />
    );
  };

  if (!storedData) {
    return (
      <View style={[styles.activityIndicator, {height, width}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.historyTitle, {color: theme.primary}]}>
        Location History
      </Text>
      <FlatList
        data={storedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  historyTitle: {
    fontSize: 23,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
