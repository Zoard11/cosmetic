import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import Home from './Home';
import Information from './Information';
import Picture from './Picture';
import Products from './Products';

import {createDrawerNavigator} from '@react-navigation/drawer';
export const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRoute="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Information" component={Information} />
        <Drawer.Screen name="Picture" component={Picture} />
        <Drawer.Screen name="Products" component={Products} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
