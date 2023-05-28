import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Text,
  Card,
  Button,
  TextInput,
  Divider,
  RadioButton,
  IconButton,
  Dialog,
  PaperProvider,
  Portal,
  Modal,
} from 'react-native-paper';

import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {Api} from '../store';
import {DialogFailRegister, DialogSuccessRegister} from './Dialog';

const Register = ({navigation}) => {
  const [UserCredential, setUserCredential] = useState({
    username: '',
    firstname: '',
    lastname: '',
    gender: '',
    birthdate: moment().format('YYYY-MM-DD'),
    password: '',
  });

  const [PassVerify, setPassVerify] = useState('');
  const [Valid, setValid] = useState(false);
  const [OpenDate, setOpenDate] = useState(false);
  const [Url, setUrl] = useRecoilState(Api);
  const [ErrorDialog, setErrorDialog] = useState(false);
  const [SuccessDialog, setSuccessDialog] = useState(false);

  const verifyPassword = () => {
    if (UserCredential.password != PassVerify) {
      setValid(false);
    } else {
      setValid(true);
    }
  };

  const onSubmit = async () => {
    try {
      axios
        .post(`${Url}/api/users/register`, UserCredential)
        .then(() => {
          setSuccessDialog(true);
        })
        .catch(error => {
          console.error(error.message);
          setErrorDialog(true);
        });
    } catch (error) {
      setErrorDialog(true);
      console.error(error.message);
    }
  };

  const hideErrorDialog = () => {
    setErrorDialog(false);
    navigation.navigate('Login');
  };
  const hideSuccessDialog = () => {
    setSuccessDialog(false);
    navigation.navigate('Login');
  };

  useEffect(() => {
    verifyPassword();
  }, [UserCredential, PassVerify]);

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <DialogSuccessRegister
          visible={SuccessDialog}
          hideDialog={hideSuccessDialog}
        />
        <DialogFailRegister
          visible={ErrorDialog}
          hideDialog={hideErrorDialog}
        />
        {/* <Button
        mode="contained"
        style={styles.input}
        onPress={() => {
          setErrorDialog(true);
        }}>
        Open Dialog
      </Button> */}
        <Card style={styles.card}>
          <Card.Title title="Register" titleVariant="titleLarge" />
          <Card.Content>
            <TextInput
              label="Username"
              style={styles.input}
              value={UserCredential.username}
              onChangeText={value => {
                setUserCredential({...UserCredential, username: value});
              }}
            />
            <TextInput
              label="Password"
              style={styles.input}
              value={UserCredential.password}
              error={!Valid}
              secureTextEntry
              onChangeText={value => {
                setUserCredential({...UserCredential, password: value});
              }}
            />
            <TextInput
              label="Confirm Password"
              style={styles.input}
              value={PassVerify}
              error={!Valid}
              secureTextEntry
              onChangeText={value => {
                setPassVerify(value);
              }}
            />
            <Divider />
            <TextInput
              label="First Name"
              style={styles.input}
              value={UserCredential.firstname}
              onChangeText={value => {
                setUserCredential({...UserCredential, firstname: value});
              }}
            />
            <TextInput
              label="Last Name"
              style={styles.input}
              value={UserCredential.lastname}
              onChangeText={value => {
                setUserCredential({...UserCredential, lastname: value});
              }}
            />

            <View style={styles.radioContainer}>
              <RadioButton.Android
                value="Laki-laki"
                status={
                  UserCredential.gender === 'Laki-laki'
                    ? 'checked'
                    : 'unchecked'
                }
                // label="Laki-laki"
                onPress={() =>
                  setUserCredential({...UserCredential, gender: 'Laki-laki'})
                }
              />
              <Text>Laki-laki</Text>
            </View>
            <View style={styles.radioContainer}>
              <RadioButton.Android
                value="Perempuan"
                status={
                  UserCredential.gender === 'Perempuan'
                    ? 'checked'
                    : 'unchecked'
                }
                // label="Perempuan"
                onPress={() =>
                  setUserCredential({...UserCredential, gender: 'Perempuan'})
                }
              />
              <Text>Perempuan</Text>
            </View>

            <View style={styles.radioContainer}>
              <TextInput
                value={UserCredential.birthdate}
                style={{width: '80%'}}
              />
              <IconButton
                icon="calendar-today"
                size={30}
                style={{width: '20%'}}
                onPress={() => {
                  setOpenDate(true);
                }}
              />
            </View>

            <DatePicker
              modal
              mode="date"
              open={OpenDate}
              onConfirm={date => {
                setOpenDate(false);
                setUserCredential({
                  ...UserCredential,
                  birthdate: moment(date).format('YYYY-MM-DD'),
                });
              }}
              onCancel={() => {
                setOpenDate(false);
              }}
              date={moment(UserCredential.birthdate, 'YYYY-MM-DD').toDate()}
            />

            <Button mode="contained" style={styles.input} onPress={onSubmit}>
              Register
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: '20%',
    marginHorizontal: 20,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
  },
  radioContainer: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Register;
