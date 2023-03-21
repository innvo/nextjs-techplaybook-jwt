import axios from 'axios';
//ali
const axiosInt = axios.create({ 
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

 //ALI 20230305
 
axiosInt.interceptors.response.use(
  (res) => {  
    axiosInt.defaults.headers.common = {
      'Authorization': 'Bearer ' +  localStorage.getItem('accessToken')
    };  
    return Promise.resolve(res);
  },
  (err) => {
    console.log(err.response.status);
    return Promise.reject(err);
  }
);


export default axiosInt;
