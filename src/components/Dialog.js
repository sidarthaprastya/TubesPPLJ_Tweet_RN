import {View} from 'react-native';
import React, {useState} from 'react';
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Surface,
  Text,
} from 'react-native-paper';

const DialogSuccessRegister = ({hideDialog, visible}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title> Registration Successed!</Dialog.Title>
        <Dialog.Content>
          <Text style={{margin: 10}}>
            User has sucessfully been registered!
          </Text>
          <Button onPress={hideDialog}>OK</Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const DialogFailRegister = ({visible, hideDialog}) => {
  const [Visibility, setVisibility] = useState(visible);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title> Registration Failed!</Dialog.Title>
        <Dialog.Content>
          <Text style={{margin: 10}}>Cannot register this user!</Text>
          <Button onPress={hideDialog}>OK</Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const DialogPop = ({visible, hideDialog, title, text}) => {
  const [Visibility, setVisibility] = useState(visible);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title> {title}</Dialog.Title>
        <Dialog.Content>
          <Text style={{margin: 10}}>{text}</Text>
          <Button onPress={hideDialog}>OK</Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const DialogConfirmation = ({visible, onDeny, onConfirm, title, text}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDeny}>
        <Dialog.Title> {title}</Dialog.Title>
        <Dialog.Content>
          <Text style={{margin: 10}}>{text}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button onPress={onDeny}>No</Button>
            <Button onPress={onConfirm}>Yes</Button>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export {
  DialogSuccessRegister,
  DialogFailRegister,
  DialogPop,
  DialogConfirmation,
};
