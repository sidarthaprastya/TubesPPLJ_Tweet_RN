const {atom} = require('recoil');

const Api = atom({
  key: 'api-url',
  default: 'http://192.168.100.6:8080',
});

export {Api};
