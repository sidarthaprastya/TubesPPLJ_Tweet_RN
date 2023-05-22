import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {Button, Card, TextInput} from 'react-native-paper';

import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api} from '../store';
import {DialogPop} from './Dialog';

const CreatePost = ({callbackAction}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [Message, setMessage] = useState({
    message: '',
  });

  const [DialogView, setDialogView] = useState(false);

  const onSubmit = async () => {
    axios
      .post(`${Url}/api/posts/write`, Message)
      .then(() => {
        setDialogView(true);
        setMessage({message: ''});
        callbackAction();
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const hideDialog = () => {
    setDialogView(false);
  };

  return (
    <Card
      mode="elevated"
      elevation={1}
      style={{padding: 20, marginVertical: 20}}>
      <View>
        {/* <Card.Title title="Write a post" /> */}
        <Card.Content style={{marginBottom: 20}}>
          <TextInput
            mode="outlined"
            multiline={true}
            label="Write a post..."
            value={Message.message}
            onChangeText={value => {
              setMessage({message: value});
            }}
          />
        </Card.Content>
        <DialogPop
          visible={DialogView}
          hideDialog={hideDialog}
          title="Success Notification"
          text="Write a post success!"
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Button
            icon="trash-can"
            mode="contained"
            onPress={() => {
              setMessage('');
            }}>
            Delete
          </Button>
          <Button icon="pen" mode="contained" onPress={onSubmit}>
            Post
          </Button>
        </View>
      </View>
    </Card>
  );
};

export default CreatePost;
