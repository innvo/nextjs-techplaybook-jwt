import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { User } from 'src/models/user';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface UserState {
  users: User[];
}


const initialState: UserState = {
  users: []
};

//Initialize slice
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers(state: UserState, action: PayloadAction<User[]>): void {
      state.users = action.payload;
    },
    createUser(state: UserState, action: PayloadAction<User>): void {
      state.users.push(action.payload);
    },
    updateUser(state: UserState, action: PayloadAction<User>): void {
      const user = action.payload;

      state.users = state.users.map((_user) => {
        if (_user.id === user.id) {
          return user;
        }

        return _user;
      });
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getUsers =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:getUsers');
    const data = await axiosInt.get('/api/users/')
    dispatch(slice.actions.getUsers(data.data));
  };

export const createUser =  
  (user: User, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:createUser');
    try {
      const data = await axiosInt.post('/api/admin/users', user)
      dispatch(slice.actions.getUsers(data.data));
      enqueueSnackbar('The user account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the user', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateUser =
  (userId: string, update: any): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:updateUser');
    const data = await axiosInt.get('/api/users/')

    dispatch(slice.actions.updateUser(data.data));
  };

export const deleteUser =
  (userId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    await axiosInt.get('/api/users/')
    //ECHASIN why is deleteUser not defined in const slice
    //dispatch(slice.actions.deleteUser(userId));
  };

export default slice;
