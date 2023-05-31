import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Projectbillingtype } from 'src/models/projectbillingtype';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface ProjectbillingtypeState {
  projectbillingtype: Projectbillingtype[];
  currentProjectbillingtype: Projectbillingtype;
}


const initialState: ProjectbillingtypeState = {
  projectbillingtype: [],
  currentProjectbillingtype: {
    id: 0,
    name: '',
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'projectbillingtype',
  initialState,
  reducers: {
    getProjectbillingtypes(state: ProjectbillingtypeState, action: PayloadAction<Projectbillingtype[]>): void {
      state.projectbillingtype = action.payload;
    },
    getProjectbillingtype(state: ProjectbillingtypeState, action: PayloadAction<Projectbillingtype>): void {
      state.currentProjectbillingtype = action.payload;
    },
    createProjectbillingtype(state: ProjectbillingtypeState, action: PayloadAction<Projectbillingtype>): void {
      state.projectbillingtype.push(action.payload);
    },
    updateProjectbillingtype(state: ProjectbillingtypeState, action: PayloadAction<Projectbillingtype>): void {
      const projectbillingtype = action.payload;

      state.projectbillingtype = state.projectbillingtype.map((_projectbillingtype) => {
        if (_projectbillingtype.id === projectbillingtype.id) {
          return projectbillingtype;
        }

        return _projectbillingtype;
      });
    },
    deleteProjectbillingtype(state: ProjectbillingtypeState, action: PayloadAction<Projectbillingtype[]>): void {
      state.projectbillingtype = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:
export const { reducer } = slice;

export const getProjectbillingtypes =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectbillingtype.ts:getProjectbillingtype');
    const data = await axiosInt.get('/api/projectbillingtypes'  )
    dispatch(slice.actions.getProjectbillingtypes(data.data));
};

export const getProjectbillingtype =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectbillingtype.ts:getProjectbillingtype');
    const data = await axiosInt.get('/api/projectbillingtypees/id/' + id)
    dispatch(slice.actions.getProjectbillingtype(data.data));
};

export const createProjectbillingtype =  
  (projectbillingtype: Projectbillingtype, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectbillingtype.ts:createProjectbillingtype');
    try {
      const data = await axiosInt.post('/api/projectbillingtypees', projectbillingtype)
      dispatch(slice.actions.getProjectbillingtype(data.data));
      enqueueSnackbar('The projectbillingtype account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the projectbillingtypees', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateProjectbillingtype =
  (projectbillingtype: Projectbillingtype, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectbillingtype.ts:updateProjectbillingtype');
    try {
      const data = await axiosInt.put('/api/admin/projectbillingtypees', projectbillingtype)
      dispatch(slice.actions.getProjectbillingtype(data.data));
      enqueueSnackbar('The projectbillingtype account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the projectbillingtypees', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteProjectbillingtype =
  (projectbillingtypeId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/projectbillingtypees/'+ projectbillingtypeId)
      dispatch(slice.actions.getProjectbillingtype(data.data));
      enqueueSnackbar('The projectbillingtype account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the projectbillingtype', {
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
