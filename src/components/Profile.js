import {View} from 'react-native';
import React from 'react';
import {Avatar, Button, Card, IconButton, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api} from '../store';

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
        right={props => <IconButton icon="logout" size={30} onPress={LogOut} />}
      />
    </Card>
  );
};

export default Profile;
