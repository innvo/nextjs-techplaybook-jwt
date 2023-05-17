import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { UserProfile } from 'src/models/userProfile';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface UserProfileState {
  userProfiles: UserProfile[];
  userProjectProfiles: UserProfile[];
  currentUserProfile: UserProfile;
}


const initialState: UserProfileState = {
  userProfiles: [],
  currentUserProfile: {
    id: 0,
    login: '',
    status: '',
    createdby: '',
    createdatetime: Date.now(),
    lastmodifiedby: '',
    lastmodifiedatetime: Date.now(),
    domain: 0,
  },
  userProjectProfiles: []
};

//Initialize slice
const slice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    getUserProfiles(state: UserProfileState, action: PayloadAction<UserProfile[]>): void {
      state.userProfiles = action.payload;
    },
    getProjectUserProfiles(state: UserProfileState, action: PayloadAction<UserProfile[]>): void {
      state.userProjectProfiles = action.payload;
    },
    getUserProfile(state: UserProfileState, action: PayloadAction<UserProfile>): void {
      state.currentUserProfile = action.payload;
    },
    createUserProfile(state: UserProfileState, action: PayloadAction<UserProfile>): void {
      state.userProfiles.push(action.payload);
    },
    updateUserProfile(state: UserProfileState, action: PayloadAction<UserProfile>): void {
      const userProfile = action.payload;

      state.userProfiles = state.userProfiles.map((_userProfile) => {
        if (_userProfile.id === userProfile.id) {
          return userProfile;
        }

        return _userProfile;
      });
    },
    deleteUserProfile(state: UserProfileState, action: PayloadAction<UserProfile[]>): void {
      state.userProfiles = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getUserProfiles =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In userProfile.ts:getUserProfiles');
    const data = await axiosInt.get('/api/userprofiles'  )
    dispatch(slice.actions.getUserProfiles(data.data));
};

export const getProjectUserProfiles =
  (projectId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In userProfile.ts:getUserProfiles');
    const data = await axiosInt.get('/api/userprofiles/project/'+ projectId  )
    dispatch(slice.actions.getProjectUserProfiles(data.data));
};

export const getUserProfile =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In userProfile.ts:getUserProfile');
    const data = await axiosInt.get('/api/userProfiles/' + id)
    dispatch(slice.actions.getUserProfile(data.data));
};

export const createUserProfile =  
  (userProfile: any, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In userProfile.ts:createUserProfile');
    try {
      const data = await axiosInt.post('/api/userProfiles', userProfile)
      dispatch(slice.actions.getUserProfiles(data.data));
      enqueueSnackbar('The userProfile account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the userProfile', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateUserProfile =
  (userProfile: UserProfile, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In userProfile.ts:updateUserProfile');
    try {
      const data = await axiosInt.put('/api/userProfiles/'+ userProfile.id, userProfile)
      dispatch(slice.actions.getUserProfiles(data.data));
      enqueueSnackbar('The userProfile account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the userProfile', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteUserProfile =
  (userProfileId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/userProfiles/'+ userProfileId)
      dispatch(slice.actions.getUserProfiles(data.data));
      enqueueSnackbar('The userProfile account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the userProfile', {
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
