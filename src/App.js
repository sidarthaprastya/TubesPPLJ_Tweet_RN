import {View, Text} from 'react-native';
import React from 'react';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import {RecoilRoot} from 'recoil';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';
import NestedScreen from './components/NestedScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <RecoilRoot>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="MainLayout" component={MainLayout} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />

            {/* <Stack.Screen name="NestedScreen" component={NestedScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </RecoilRoot>
  );
};

export default App;
