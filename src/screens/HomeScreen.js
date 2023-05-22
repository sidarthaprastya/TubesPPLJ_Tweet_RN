import {View, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import Posts from '../components/Posts';
import CreatePost from '../components/CreatePost';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api} from '../store';
import moment from 'moment';

const HomeScreen = ({navigation}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [PostArray, setPostArray] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllPosts();
    });
    return unsubscribe;
  }, [navigation]);

  const getAllPosts = async () => {
    axios
      .get(`${Url}/api/posts/`)
      .then(response => {
        setPostArray(response.data);
        console.log(PostArray);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    // <Text>Hai</Text>
    <ScrollView>
      <View style={{padding: 20}}>
        <CreatePost callbackAction={getAllPosts} />
        {PostArray.map(post => (
          <Posts
            key={post.mid}
            enableDelete={false}
            username={post.uname}
            message={post.messages}
            date={moment(post.created_at).format(`DD MMM YYYY`)}
            time={moment(post.created_at).format(`hh:mm a`)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
