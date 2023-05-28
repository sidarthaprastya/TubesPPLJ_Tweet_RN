import {View, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import Posts from '../components/Posts';
import {useRecoilState} from 'recoil';
import {Api, Uname} from '../store';
import moment from 'moment';
import axios from 'axios';
import {Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyPostScreen = ({navigation}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [PostArray, setPostArray] = useState([]);
  const [Username, setUsername] = useRecoilState(Uname);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMyPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyPosts();
      // getMyReply();
    });
    return unsubscribe;
  }, [navigation]);

  const getMyReply = async () => {
    axios.get(`${Url}/api/posts/reply/mine`).then(resp => {
      console.log('username', Username);
      let arr_mid = [];
      for (var i = 0; i < resp.data.length; i++) {
        arr_mid = [...arr_mid, resp.data[i].mid];
      }
      // console.log(arr_mid);
      var unique = arr_mid.filter(onlyUnique);

      for (var i = 0; i < unique.length; i++) {
        axios.get(`${Url}/api/posts/${unique[i]}`).then(resp1 => {
          if (resp1.data.message[0].uname != Username) {
            console.log(resp1.data.message[0]);
            setPostArray(PostArray => [...PostArray, resp1.data.message[0]]);
          }
        });
      }
    });
  };

  const getMyPosts = async () => {
    axios
      .get(`${Url}/api/posts/mine`)
      .then(response => {
        // setPostArray([]);
        setPostArray(response.data);
        // console.log(PostArray);
      })
      .then(() => {
        getMyReply();
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const deleteCallback = mid => {
    setPostArray(PostArray.filter(obj => obj.mid !== mid));
  };

  // useEffect(() => {
  //   console.log("Profile reply")
  //   // getMyReply();
  // }, [PostArr]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{padding: 20}}>
        {PostArray.length == 0 ? (
          <Card
            style={{
              marginVertical: '50%',
              marginHorizontal: 20,
              padding: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            <Card.Content>
              <View style={{alignSelf: 'center', padding: 10}}>
                <Icon name="message" size={50} />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                  fontWeight: '900',
                }}
                variant="headlineSmall">
                There is no post yet.
              </Text>
              <Text style={{textAlign: 'center'}} variant="titleMedium">
                Write your post first...
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <View>
            {PostArray.sort((a, b) => b.mid - a.mid).map((post, index) => {
              if (post.uname != Username) {
                return (
                  <Posts
                    key={index}
                    mid={post.mid}
                    enableDelete={false}
                    username={post.uname}
                    message={post.messages}
                    date={moment(post.created_at).format(`DD MMM YYYY`)}
                    time={moment(post.created_at).format(`hh:mm a`)}
                    // date="A"
                    // time="A"
                    deleteAction={deleteCallback}
                    editCallback={getMyPosts}
                  />
                );
              } else {
                return (
                  <Posts
                    key={index}
                    mid={post.mid}
                    enableDelete={true}
                    username={post.uname}
                    message={post.messages}
                    date={moment(post.created_at).format(`DD MMM YYYY`)}
                    time={moment(post.created_at).format(`hh:mm a`)}
                    deleteAction={deleteCallback}
                    editCallback={getMyPosts}
                  />
                );
              }
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MyPostScreen;
