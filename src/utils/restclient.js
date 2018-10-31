import axios from 'axios';
import store from 'store';

const restclient = () => (
  axios.create({
    baseURL: 'http://shared-server-25.herokuapp.com',
    headers: {
      'X-Access-Token': store.get('token'),
      'Access-Control-Allow-Origin': '*',
    },
  })
);

export default restclient;