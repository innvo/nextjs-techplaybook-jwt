import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { User } from 'src/models/user';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface UserState {
  users: User[];
  currentUser: User;
}


const initialState: UserState = {
  users: [],
  currentUser: {
    id: 0,
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    activated: false,
    langKey: '',
    jobtitle: '',
    avatar: '',
    authorities: [],
    lastModifiedDate: ''
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers(state: UserState, action: PayloadAction<User[]>): void {
      state.users = action.payload;
    },
    getUser(state: UserState, action: PayloadAction<User>): void {
      state.currentUser = action.payload;
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
    },
    deleteUser(state: UserState, action: PayloadAction<User[]>): void {
      state.users = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getUsers =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:getUsers');
    const data = await axiosInt.get('/api/admin/users/')
    dispatch(slice.actions.getUsers(data.data));
};

export const getUser =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:getUser');
    const data = await axiosInt.get('/api/admin/users/id/' + id)
    dispatch(slice.actions.getUser(data.data));
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
  (user: User, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:updateUser');
    try {
      const data = await axiosInt.put('/api/admin/users', user)
      dispatch(slice.actions.getUsers(data.data));
      enqueueSnackbar('The user account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the user', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const changePassword =
  (user: User, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:updateUser');
    try {
      await axiosInt.post('/api/account/change-password', user)
      enqueueSnackbar('The user password was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the password', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const resetPassword =
  (user: User, enqueueSnackbar, router): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In user.ts:updateUser');
    try {
      await axiosInt.post('/api/account/reset-password/finish', user)
      router.push('/auth/reset-password/success');    
    } catch (err) {
      enqueueSnackbar('Error in rest the password', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const resetPasswordInit =
  (email: string, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log(email);
    try {
      await axiosInt.post('/api/account/reset-password/init', email, { headers: { ['Content-Type']: 'text/plain' } })
    } catch (err) {
      enqueueSnackbar('Error in rest the password', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteUser =
  (userId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/admin/users/'+ userId)
      dispatch(slice.actions.getUsers(data.data));
      enqueueSnackbar('The user account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the user', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
  };

export default slice;
