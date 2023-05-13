import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Projectstatus } from 'src/models/projectstatus';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface ProjectstatusState {
  projectstatuss: Projectstatus[];
  currentProjectstatus: Projectstatus;
}


const initialState: ProjectstatusState = {
  projectstatuss: [],
  currentProjectstatus: {
    id: 0,
    name: '',
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'projectstatus',
  initialState,
  reducers: {
    getProjectstatuss(state: ProjectstatusState, action: PayloadAction<Projectstatus[]>): void {
      state.projectstatuss = action.payload;
    },
    getProjectstatus(state: ProjectstatusState, action: PayloadAction<Projectstatus>): void {
      state.currentProjectstatus = action.payload;
    },
    createProjectstatus(state: ProjectstatusState, action: PayloadAction<Projectstatus>): void {
      state.projectstatuss.push(action.payload);
    },
    updateProjectstatus(state: ProjectstatusState, action: PayloadAction<Projectstatus>): void {
      const projectstatus = action.payload;

      state.projectstatuss = state.projectstatuss.map((_projectstatus) => {
        if (_projectstatus.id === projectstatus.id) {
          return projectstatus;
        }

        return _projectstatus;
      });
    },
    deleteProjectstatus(state: ProjectstatusState, action: PayloadAction<Projectstatus[]>): void {
      state.projectstatuss = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:
export const { reducer } = slice;

export const getProjectstatuss =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectstatus.ts:getProjectstatus');
    const data = await axiosInt.get('/api/projectstatuses'  )
    dispatch(slice.actions.getProjectstatuss(data.data));
};

export const getProjectstatus =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectstatus.ts:getProjectstatus');
    const data = await axiosInt.get('/api/projectstatuses/id/' + id)
    dispatch(slice.actions.getProjectstatus(data.data));
};

export const createProjectstatus =  
  (projectstatus: Projectstatus, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectstatus.ts:createProjectstatus');
    try {
      const data = await axiosInt.post('/api/projectstatuses', projectstatus)
      dispatch(slice.actions.getProjectstatuss(data.data));
      enqueueSnackbar('The projectstatus account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the projectstatuses', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateProjectstatus =
  (projectstatus: Projectstatus, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In projectstatus.ts:updateProjectstatus');
    try {
      const data = await axiosInt.put('/api/admin/projectstatuses', projectstatus)
      dispatch(slice.actions.getProjectstatuss(data.data));
      enqueueSnackbar('The projectstatus account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the projectstatuses', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteProjectstatus =
  (projectstatusId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/projectstatuses/'+ projectstatusId)
      dispatch(slice.actions.getProjectstatuss(data.data));
      enqueueSnackbar('The projectstatus account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the projectstatus', {
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
