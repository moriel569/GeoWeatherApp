import * as React from 'react';
import {useEffect} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import geoService from './services/geoService';

const HomeScreen = () => {
  useEffect(() => {
    geoService();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name="location" color={'red'} size={75} />
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'md-partly-sunny';
            } else if (route.name === 'History') {
              iconName = 'md-list';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
