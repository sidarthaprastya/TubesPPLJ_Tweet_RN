import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Posts from '../components/Posts';
import {useRecoilState} from 'recoil';
import {Api} from '../store';
import moment from 'moment';
import axios from 'axios';

const MyPostScreen = ({navigation}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [PostArray, setPostArray] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyPosts();
    });
    return unsubscribe;
  }, [navigation]);

  const getMyPosts = async () => {
    axios
      .get(`${Url}/api/posts/mine`)
      .then(response => {
        setPostArray(response.data);
        // console.log(PostArray);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const deleteCallback = mid => {
    setPostArray(PostArray.filter(obj => obj.mid !== mid));
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <ScrollView>
      <View style={{padding: 20}}>
        {PostArray.map(post => (
          <Posts
            key={post.mid}
            mid={post.mid}
            enableDelete={true}
            username={post.uname}
            message={post.messages}
            date={moment(post.created_at).format(`DD MMM YYYY`)}
            time={moment(post.created_at).format(`hh:mm a`)}
            deleteAction={deleteCallback}
            editCallback={getMyPosts}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default MyPostScreen;
