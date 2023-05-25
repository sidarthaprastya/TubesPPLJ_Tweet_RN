import {AppState, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Button, Card, IconButton, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api, Stay} from '../store';
import {DialogConfirmation} from './Dialog';

const ProfileAvatar = props => {
  return (
    <Avatar.Icon
      {...props}
      size={40}
      style={{backgroundColor: '#DDE6ED'}}
      icon={() => <Icon name="person" size={30} />}
    />
  );
};

const Profile = ({setLogOut, name, username}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [StaySigned, setStaySigned] = useRecoilState(Stay);
  const [LogoutConfirmation, setLogoutConfirmation] = useState(false);

  const appState = useRef(AppState.currentState);
  const [AppStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    function handleAppStateChange(nextAppState) {
      // If app is transitioning to the background, start the timeout to log out the user
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (!StaySigned) {
          LogOut();
        }
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    }

    const AppStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Clean up the event listener when unmounting the component
    return () => {
      AppStateListener?.remove();
    };
  }, [AppStateVisible]);

  const LogOut = async () => {
    axios
      .get(`${Url}/api/auth/logout`)
      .then(() => {
        console.log('Berhasil Logout');
        setLogOut();
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  return (
    <Card mode="elevated" elevation={2} style={{borderRadius: 0}}>
      <Card.Title
        title={name}
        titleVariant="titleMedium"
        subtitle={'@' + username}
        left={ProfileAvatar}
        right={props => (
          <IconButton
            icon="logout"
            size={30}
            onPress={() => {
              setLogoutConfirmation(true);
            }}
          />
        )}
      />
      <DialogConfirmation
        visible={LogoutConfirmation}
        title="Log-Out Confirmation"
        text="Are you sure want to Log-Out?"
        onDeny={() => setLogoutConfirmation(false)}
        onConfirm={() => {
          LogOut();
          setLogoutConfirmation(false);
        }}
      />
    </Card>
  );
};

export default Profile;
