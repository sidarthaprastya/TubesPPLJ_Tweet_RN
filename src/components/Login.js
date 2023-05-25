import React, {useState} from 'react';
import {Card, Text, TextInput, Button, RadioButton} from 'react-native-paper';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useRecoilState} from 'recoil';
import {Api, Stay, Uname} from '../store';
import axios from 'axios';
import {DialogPop} from './Dialog';
import CookieManager from '@react-native-cookies/cookies';

const Login = ({navigation}) => {
  const [Url, setUrl] = useRecoilState(Api);
  const [user_name, setUser_name] = useRecoilState(Uname);
  const [LoginData, setLoginData] = useState({
    username: '',
    passowrd: '',
  });
  const [SuccessDialogVisible, setSuccessDialogVisible] = useState(false);
  const [FailDialogVisible, setFailDialogVisible] = useState(false);

  const [StaySigned, setStaySigned] = useRecoilState(Stay);

  const onSubmit = async () => {
    try {
      axios
        .post(`${Url}/api/auth/login`, LoginData)
        .then(resp => {
          navigation.navigate('MainLayout', {userLogin: LoginData.username});
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <RadioButton.Android
                value={true}
                status={StaySigned === true ? 'checked' : 'unchecked'}
                onPress={() => setStaySigned(!StaySigned)}
              />
              <Text>Stay signed in?</Text>
            </View>
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
