import {StyleSheet, View} from 'react-native';
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
import {Api, Uname} from '../store';
import axios from 'axios';
import {DialogConfirmation, DialogPop} from './Dialog';
import Comment from './Comment';
import moment from 'moment';
import CreateComment from './CreateComment';

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
  const [MyUsername, setMyUsername] = useRecoilState(Uname);
  const [User, setUser] = useState({
    fname: '',
    lname: '',
  });

  const [ReplyInfo, setReplyInfo] = useState([]);

  const [EditedMessage, setEditedMessage] = useState({message: message});
  const [HideComment, setHideComment] = useState(true);
  const [CommentView, setCommentView] = useState(false);
  const [EditView, setEditView] = useState(false);
  const [DialogView, setDialogView] = useState(false);
  const [DeleteConfirmationView, setDeleteConfirmationView] = useState(false);

  const hideDialog = () => {
    setDialogView(false);
  };

  const commentCallback = prop => {
    if (prop == false) {
      setCommentView(false);
      getReplyInfo();
      editCallback();
    } else {
      setCommentView(false);
      getReplyInfo();
      editCallback();
    }
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

  const getReplyInfo = async () => {
    axios
      .get(`${Url}/api/posts/reply/${mid}`)
      .then(response => {
        setReplyInfo(response.data);
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

  const deleteCommentCallback = repid => {
    setReplyInfo(ReplyInfo.filter(obj => obj.repid != repid));
  };

  const editPost = async () => {
    axios.post(`${Url}/api/posts/edit/${mid}`, EditedMessage).then(() => {
      setDialogView(true);
      setEditView(false);
      editCallback();
    });
  };

  useEffect(() => {
    getReplyInfo();
    getUserInfo();
  }, [CommentView, HideComment]);

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
      <DialogConfirmation
        visible={DeleteConfirmationView}
        onDeny={() => {
          setDeleteConfirmationView(false);
        }}
        onConfirm={deletePost}
        title="Delete Confirmation"
        text="Are you sure want to delete this post?"
      />
      <Card.Title
        title={User.fname + ' ' + User.lname}
        subtitle={'@' + username}
        left={ProfileAvatar}
        right={() => TimeStamp(date, time)}
      />
      <Divider style={styles.divider} />
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
      <Divider style={styles.divider} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        {!CommentView && !EditView ? (
          <Button
            icon="comment"
            mode="contained"
            onPress={() => {
              setCommentView(true);
            }}
            style={{flex: 1, margin: 10}}>
            Comment
          </Button>
        ) : (
          // <View />
          <View />
        )}

        {enableDelete && !EditView && !CommentView ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
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
                onPress={() => {
                  setDeleteConfirmationView(true);
                }}
              />
            </View>
          </View>
        ) : enableDelete && EditView && !CommentView ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button
              icon="pen"
              style={{flex: 1, margin: 10}}
              mode="contained"
              onPress={editPost}>
              Submit
            </Button>
            <Button
              icon="cancel"
              mode="contained"
              style={{flex: 1, margin: 10}}
              onPress={() => {
                setEditView(false);
              }}>
              Cancel
            </Button>
          </View>
        ) : (
          // <View />
          <View></View>
        )}
      </View>

      <View>
        {CommentView ? (
          <CreateComment mid={mid} commentCallback={commentCallback} />
        ) : (
          <View></View>
        )}

        {ReplyInfo.length > 0 && !HideComment ? (
          <View>
            <Text
              variant="labelMedium"
              style={{
                textAlign: 'right',
                textDecorationLine: 'underline',
                margin: 10,
              }}
              onPress={() => {
                setHideComment(true);
              }}>
              Hide comment...
            </Text>
            <Divider />
            {ReplyInfo.sort((a, b) => b.repid - a.repid).map(rep => {
              if (rep.uname == MyUsername) {
                return (
                  <Comment
                    key={rep.repid}
                    enableDelete={true}
                    deleteAction={deleteCommentCallback}
                    replyInfo={rep}
                  />
                );
              } else {
                return (
                  <Comment
                    key={rep.repid}
                    enableDelete={false}
                    replyInfo={rep}
                  />
                );
              }
            })}
          </View>
        ) : ReplyInfo.length > 0 && HideComment ? (
          <View>
            <Text
              variant="labelMedium"
              style={{
                textAlign: 'right',
                textDecorationLine: 'underline',
                margin: 10,
              }}
              onPress={() => {
                setHideComment(false);
              }}>
              Show comment...({ReplyInfo.length})
            </Text>
          </View>
        ) : (
          <View />
        )}
      </View>
    </Card>
  );
};

export default Posts;

const styles = StyleSheet.create({
  divider: {
    marginVertical: 10,
  },
});
