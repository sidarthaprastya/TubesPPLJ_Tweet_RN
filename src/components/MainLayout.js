import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {Text, BottomNavigation} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, ScrollView} from 'react-native';
import Profile from './Profile';
import HomeScreen from '../screens/HomeScreen';
import MyPostScreen from '../screens/MyPostScreen';

import moment from 'moment';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api} from '../store';

const Tab = createBottomTabNavigator();

const MainLayout = ({route, navigation}) => {
  const {username} = route.params;
  const [Url, setUrl] = useRecoilState(Api);

  const [UserProfile, setUserProfile] = useState({
    uname: '',
    fname: '',
    lname: '',
    gender: '',
    date_of_birth: moment().format('YYYY-MM-DD'),
  });

  const getUserProfile = async () => {
    axios
      .get(`${Url}/api/users/${username}`)
      .then(response => {
        setUserProfile(response.data.user);
        // console.log(response.data);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const LoggedOut = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Profile
        setLogOut={LoggedOut}
        name={UserProfile.fname + ' ' + UserProfile.lname}
        username={username}
      />

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({navigation, state, descriptors, insets}) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({route, preventDefault}) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({route, focused, color}) => {
              const {options} = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({focused, color, size: 24});
              }

              return null;
            }}
            getLabelText={({route}) => {
              const {options} = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.title;

              return label;
            }}
          />
        )}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => {
              return <Icon name="home" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="MyPosts"
          component={MyPostScreen}
          options={{
            tabBarLabel: 'My Posts',
            tabBarIcon: ({color, size}) => {
              return <Icon name="person" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default MainLayout;
