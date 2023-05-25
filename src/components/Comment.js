import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, Divider, IconButton, Text} from 'react-native-paper';
import {Api} from '../store';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import moment from 'moment';
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

const TimeStamp = ({date, time}) => {
  return (
    <View
      style={{
        flex: 1,
        marginLeft: '10%',
      }}>
      <Text style={{textAlign: 'right'}}>{date}</Text>
      <Text style={{textAlign: 'right'}}>{time}</Text>
    </View>
  );
};

const Comment = ({replyInfo, enableDelete, deleteAction}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [User, setUser] = useState({
    fname: '',
    lname: '',
  });

  const getUserInfo = async () => {
    axios
      .get(`${Url}/api/users/${replyInfo.uname}`)
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const [Message, setMessage] = useState({
    messages: '',
  });

  const [DeleteConfirmationView, setDeleteConfirmationView] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const deleteComment = async () => {
    axios
      .get(`${Url}/api/posts/reply/delete/${replyInfo.repid}`)
      .then(() => {
        deleteAction(replyInfo.repid);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  return (
    <View>
      <View
        style={{
          padding: 20,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{width: '20%'}}>
          <ProfileAvatar />
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View>
            <Text>{User.fname + ' ' + User.lname}</Text>
            <Text>{replyInfo.uname}</Text>
          </View>
          <TimeStamp
            date={moment(replyInfo.created_at).format('DD MMM YYYY')}
            time={moment(replyInfo.created_at).format('hh:mm a')}
          />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{width: '20%', justifyContent: 'center'}}>
          {enableDelete ? (
            <IconButton
              onPress={() => {
                setDeleteConfirmationView(true);
              }}
              icon="trash-can"
              size={20}
            />
          ) : (
            <View />
          )}
        </View>
        <View
          style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
          <Divider />
          <Text style={{marginVertical: 10}}>{replyInfo.messages}</Text>
        </View>
      </View>
      <Divider />
      <DialogConfirmation
        visible={DeleteConfirmationView}
        title="Delete Confirmation"
        text="Are you sure want to delete this comment?"
        onDeny={() => setDeleteConfirmationView(false)}
        onConfirm={() => {
          deleteComment();
          setDeleteConfirmationView(false);
        }}
      />
    </View>
  );
};

export default Comment;
