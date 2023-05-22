import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, Divider, Text} from 'react-native-paper';
import {Api} from '../store';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const TimeStamp = (date, time) => {
  return (
    <View>
      <Text>{date}</Text>
      <Text>{time}</Text>
    </View>
  );
};

const Comment = () => {
  const [Url, setUrl] = useRecoilState(Api);
  const [User, setUser] = useState({
    fname: '',
    lname: '',
  });

  const [Message, setMessage] = useState({
    messages,
  });

  return (
    <View>
      <Text>Comments</Text>
    </View>
  );
};

export default Comments;
