import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  Card,
  Text,
  Divider,
  IconButton,
  TextInput,
} from 'react-native-paper';
import Profile from './Profile';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import {Api} from '../store';
import axios from 'axios';
import {DialogPop} from './Dialog';

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

const Posts = ({
  mid,
  username,
  message,
  date,
  time,
  enableDelete,
  deleteAction,
  editCallback,
}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [User, setUser] = useState({
    fname: '',
    lname: '',
  });
  const [EditedMessage, setEditedMessage] = useState({message: message});

  const [EditView, setEditView] = useState(false);
  const [DialogView, setDialogView] = useState(false);

  const hideDialog = () => {
    setDialogView(false);
  };

  const getUserInfo = async () => {
    axios
      .get(`${Url}/api/users/${username}`)
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const deletePost = async () => {
    axios
      .get(`${Url}/api/posts/delete/${mid}`)
      .then(() => {
        deleteAction(mid);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const editPost = async () => {
    axios
      .post(`${Url}/api/posts/edit/${Number(mid)}`, EditedMessage)
      .then(() => {
        setDialogView(true);
        setEditView(false);
        editCallback();
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Card
      mode="elevated"
      elevation={1}
      style={{padding: 20, marginVertical: 10}}
      // style={{padding: 20, backgroundColor: '#F0F0F0'}}
    >
      <DialogPop
        visible={DialogView}
        hideDialog={hideDialog}
        title="Success Notification"
        text="Edit a post success!"
      />
      <Card.Title
        title={User.fname + ' ' + User.lname}
        subtitle={'@' + username}
        left={ProfileAvatar}
        right={() => TimeStamp(date, time)}
      />
      <Divider />
      <Card.Content style={{marginVertical: 20}}>
        {EditView ? (
          <TextInput
            mode="flat"
            multiline={true}
            value={EditedMessage.message}
            onChangeText={value => {
              setEditedMessage({message: value});
            }}
          />
        ) : (
          <Text>{message}</Text>
        )}
      </Card.Content>
      <Divider />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        {EditView ? (
          <Button
            icon="comment"
            mode="contained"
            style={{flex: 1, margin: 10}}
            onPress={editPost}>
            Submit
          </Button>
        ) : (
          <Button icon="comment" mode="contained" style={{flex: 1, margin: 10}}>
            Comment
          </Button>
        )}

        {enableDelete ? (
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <IconButton
              icon="pen"
              size={30}
              mode="contained"
              onPress={() => {
                setEditView(true);
              }}
            />

            <IconButton
              icon="trash-can"
              size={30}
              mode="contained"
              onPress={deletePost}
            />
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </Card>
  );
};

export default Posts;
