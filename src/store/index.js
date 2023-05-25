const {atom} = require('recoil');

const Api = atom({
  key: 'api-url',
  default: 'http://192.168.43.18:8080',
});

const Uname = atom({
  key: 'username',
  default: '',
});

const Stay = atom({
  key: 'stay-signed',
  default: false,
});

export {Api, Uname, Stay};
