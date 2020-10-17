import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Item = ({title, lat, lng, city, onPress, removeItem}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={{flex: 1, marginHorizontal: 15}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.coords}>
            Lat: {lat} Lng: {lng} {city}
          </Text>
        </View>
        <View style={{flex: 1, maxWidth: 40, justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={removeItem}>
            <Icon name="trash" color={'#cbec53'} size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#7453ec',
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginHorizontal: 12,
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
