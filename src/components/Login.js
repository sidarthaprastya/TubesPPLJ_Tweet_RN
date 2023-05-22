import React, {useState} from 'react';
import {Card, Text, TextInput, Button} from 'react-native-paper';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useRecoilState} from 'recoil';
import {Api} from '../store';
import axios from 'axios';
import {DialogPop} from './Dialog';

const Login = ({navigation}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [LoginData, setLoginData] = useState({
    username: '',
    passowrd: '',
  });
  const [SuccessDialogVisible, setSuccessDialogVisible] = useState(false);
  const [FailDialogVisible, setFailDialogVisible] = useState(false);

  const onSubmit = async () => {
    try {
      axios
        .post(`${Url}/api/auth/login`, LoginData)
        .then(() => {
          navigation.navigate('MainLayout', {username: LoginData.username});
        })
        .catch(error => {
          console.error(error.message);
          setFailDialogVisible(true);
        });
    } catch (error) {
      // console.error(error.message);
      setFailDialogVisible(true);
    }
  };

  const hideDialog = () => {
    setSuccessDialogVisible(false);
    setFailDialogVisible(false);
  };

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <DialogPop
          visible={FailDialogVisible}
          hideDialog={hideDialog}
          title="Login Failed!"
          text="Incorrect username or password!"
        />
        <Card style={styles.card}>
          <Card.Title title="Login" titleVariant="titleLarge" />
          <Card.Content>
            <TextInput
              label="Username"
              style={styles.input}
              value={LoginData.username}
              onChangeText={value =>
                setLoginData({...LoginData, username: value})
              }
            />
            <TextInput
              label="Password"
              style={styles.input}
              value={LoginData.password}
              secureTextEntry
              onChangeText={value =>
                setLoginData({...LoginData, password: value})
              }
            />
            <Button mode="contained" onPress={onSubmit}>
              Login
            </Button>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text
                variant="labelMedium"
                style={{
                  alignSelf: 'center',
                  textDecorationLine: 'underline',
                  margin: 10,
                }}>
                Does not have account yet?
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: '50%',
    marginHorizontal: 20,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
  },
});

export default Login;
