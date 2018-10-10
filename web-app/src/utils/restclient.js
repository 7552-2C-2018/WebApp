import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTM5MDQ3OTg2LCJleHAiOjE1Mzk2NTI3ODZ9.XtIDvQQ1MlnC6wGy54cNmp0OnXgyIInMQjUAHARAsyk';

const restclient = () => (
  axios.create({
    baseURL: 'http://shared-server-25.herokuapp.com',
    headers: {
      'X-Access-Token': token,
      'Access-Control-Allow-Origin': '*',
    },
  })
);

export default restclient;