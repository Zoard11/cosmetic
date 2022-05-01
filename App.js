import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import Home from './Home';

import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRoute="Home">
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerIcon: config => <Icon size={23} name="home" />,
          }}
        />
        {/* <Drawer.Screen name="CameraComponent" component={CameraComponent} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
