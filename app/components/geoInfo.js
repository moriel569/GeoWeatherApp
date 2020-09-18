import React, {Component} from 'react';
import {View, Text} from 'react-native';
import GeoServices from '../services/geoService';

class geoInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  info = new GeoServices(geoService());

  render() {
    return (
      <View>
        <Text> {info.latitude}</Text>
      </View>
    );
  }
}

export default geoInfo;
