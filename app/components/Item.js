import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

export default Item = ({title, lat, lng, city, onPress}) => {
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

const styles = StyleSheet.create({
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
});
