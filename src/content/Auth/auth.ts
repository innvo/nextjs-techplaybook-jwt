import type { User } from 'src/models/user';
import { randomId } from 'src/utils/randomId';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../../utils/jwt';
import { wait } from 'src/utils/wait';

import axiosInt from 'src/utils/axios';//ali

//import React, { useState } from 'react';//ECHASIN

// const [data, setData] = useState(0);


const users = [
  {
    id: '1',
    avatar: '/static/images/avatars/3.jpg',
    location: 'San Francisco, USA',
    username: 'admin',
    email: 'demo@example.com',
    name: 'Rachael Simons',
    jobtitle: 'Lead Developer',
    password: 'admin',
    role: 'admin',
    posts: '27',
    coverImg: '/static/images/placeholders/covers/5.jpg',
    followers: '6513',
    description: 'Curabitur at ipsum ac tellus semper interdum.'
  }
];



class AuthApi1 {
 
  async login({ username, email, password }): Promise<string> {  //ECHASIN added username to login 
    console.log("In src/content/Auth/auth.ts - async login:", username);  //ECHASIN getting instance of Login

    await wait(500);

    //Ali add auth api to return token string

    return new Promise((resolve, reject) => {
      axiosInt.post('/api/authenticate', {
      //Ali  "username": 'kminchelle', 
      //Ali  "password": '0lelplR',
         "username": username,
         "password": password,
      }).then(function (response) {
        const data= response.data
        console.log('response.data:', data);
        // const bearerToken = response?.headers?.authorization;
        const bearerToken = data.id_token; //Ali
        
        console.log('bearerToken:', bearerToken);   
        resolve(bearerToken); //Ali
      })
      .catch(function (error) {
        console.log(error);
      });

     //Ali console.log('In return new Promise')
     //Ali console.log('Promise: ', Promise.resolve.toString);
    
      //CHARLES -  I NEED TO GET THE ATTRIBUTES FROM THE TOKEN SO I CAN USE IN THE BELOW ACTIONS
      //IT RETURNING THE HARDED CODE VALUES THAT Line 12
    
     //Ali try {
        //ECHASIN looking up Users from users array by username
        //ECHASIN .find is used to find a value in a array
        //ECHASIN _user is parameter name, it can be name anything
        //ECHASIN The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value     
      //Ali  const user = users.find((ABC) => ABC.username === username);  
       //Ali console.log('user: ',user); //ECHASIN
      
        //ECHASIN this is hardcoded validation
       //Ali if (!user || user.username !== username) {
       //Ali   reject(new Error('User name does not exist'));
       //Ali   return;
       //Ali }

        //ECHASIN this is hardcoded validation
       //Ali if (!user || user.password !== password) {
       //Ali   reject(new Error('Email and password combination does not match'));
       //Ali   return;
       //Ali }

       //Ali const accessToken = sign({ userId: user.id }, JWT_SECRET, {
       //Ali   expiresIn: JWT_EXPIRES_IN
       //Ali });

  
      //  resolve(accessToken);
  //Ali    } catch (err) {
      //Ali  console.error(err);
      //Ali  reject(new Error('Internal server error'));
    //Ali  }
    });
  
  }


  async register({ email, name, password }): Promise<string> {
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error('Email address is already in use'));
          return;
        }

        user = {
          id: randomId(),
          avatar: null,
          jobtitle: 'Lead Developer',
          email,
          username: null,
          name,
          password,
          location: null,
          role: 'admin',
          posts: null,
          coverImg: null,
          followers: null,
          description: null
        };

        users.push(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN
        });

        resolve(accessToken);
      } catch (err) {
        console.error(err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(accessToken): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
       // const { userId } = decode(accessToken) as any;
      
       //Ali create configuration to add  Authorization header
       let config = {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        }
      }
      axiosInt.get('/api/account', config)// Ali add api to get current logged user
        .then(function (response) {
            const data= response.data
            console.log('response.data:', data);
            const user = response.data;

            if (!user) {
              reject(new Error('Invalid authorization token'));
              return;
            }
    
            resolve({
              id: user.id,
              avatar: user.avatar,
              jobtitle: user.jobtitle,
              email: user.email,
              name: user.name,
              location: user.location,
              username: user.username,
              role: user.role,
              posts: user.posts,
              coverImg: user.coverImg,
              followers: user.followers,
              description: user.description
            });
          })
          .catch(function (error) {
            console.log(error);
        });

        //ECHASIN Returns mock JWT token
      //  console.log('me(accessToken)', accessToken);
      //  console.log('decode(accessToken)', {userId});
       
      } catch (err) {
        console.error(err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi1 = new AuthApi1();
function fetchData() {
  throw new Error('Function not implemented.');
}

