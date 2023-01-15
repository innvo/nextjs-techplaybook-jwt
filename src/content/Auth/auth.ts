import type { User } from 'src/models/user';
import { randomId } from 'src/utils/randomId';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../../utils/jwt';
import { wait } from 'src/utils/wait';

import axios from 'axios';

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

    return new Promise((resolve, reject) => {
      try {
        //ECHASIN looking up Users from users array by username
        //ECHASIN .find is used to find a value in a array
        //ECHASIN _user is parameter name, it can be name anything
        //ECHASIN The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
        console.log('Promise: ',Promise);
        const user = users.find((ABC) => ABC.username === username);  
        console.log('user: ',user); //ECHASIN

         //ECHASIN POST to authenication api
         axios.post('http://localhost:8080/api/authenticate', {
          "username": username,
          "password": "admin",
        }).then(function (response) {
          console.log('response.data:', response.data);
          const test = response.data
          console.log('test:', test)
        })
        .catch(function (error) {
          console.log(error);
        });
        
             
        //ECHASIN this is hardcoded validation
        if (!user || user.username !== username) {
          reject(new Error('User name does not exist'));
          return;
        }

        //ECHASIN this is hardcoded validation
        if (!user || user.password !== password) {
          reject(new Error('Email and password combination does not match'));
          return;
        }

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
        const { userId } = decode(accessToken) as any;
        //ECHASIN Returns mock JWT token
        console.log('me(accessToken)', accessToken);
        console.log('decode(accessToken)', {userId});
        
        //ECHASIN Check is us
        const user = users.find((_user) => _user.id === userId);

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
      } catch (err) {
        console.error(err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi1 = new AuthApi1();
