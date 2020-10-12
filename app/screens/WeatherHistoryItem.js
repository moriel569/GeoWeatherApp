import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Item = ({title, lat, lng, city, onPress, removeItem}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.coords}>
            Lat: {lat} Lng: {lng} {city}
          </Text>
        </View>
        <TouchableOpacity
          style={{flex: 1, alignItems: 'flex-end'}}
          onPress={removeItem}>
          <Icon name="trash" color={'#cbec53'} size={25} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#7453ec',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    color: '#fff',
  },
  coords: {
    fontSize: 16,
    color: '#fff',
  },
});
