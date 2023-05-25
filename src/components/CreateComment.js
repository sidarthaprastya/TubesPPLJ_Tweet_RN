import {View} from 'react-native';
import React, {useState} from 'react';
import {IconButton, TextInput} from 'react-native-paper';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api} from '../store';

const CreateComment = ({commentCallback, mid}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [Comment, setComment] = useState({message: ''});
  const commentPost = async () => {
    axios
      .post(`${Url}/api/posts/reply/${mid}`, Comment)
      .then(() => {
        commentCallback(true);
      })
      .catch(error => {
        commentCallback(false);
        console.log(error.message);
      });
  };
  return (
    <View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 10,
        }}>
        <IconButton
          icon="cancel"
          onPress={() => {
            commentCallback(false);
          }}
          size={30}
          mode="contained"
        />
        <IconButton
          icon="send"
          onPress={commentPost}
          size={30}
          mode="contained"
        />
      </View>
      <TextInput
        mode="flat"
        placeholder="Write a comment..."
        value={Comment.message}
        onChangeText={value => {
          setComment({message: value});
        }}
      />
    </View>
  );
};

export default CreateComment;
