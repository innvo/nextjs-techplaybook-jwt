import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Workspacerelcontent } from '@/models/workspacerelcontent';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface WorkspacerelcontentState {
  workspacerelcontents: Workspacerelcontent[];
  currentWorkspacerelcontent: Workspacerelcontent;
}


const initialState: WorkspacerelcontentState = {
  workspacerelcontents: [],
  currentWorkspacerelcontent: {
    id: 0,
    comment: '',
    status: '',
    createdby: '',
    createddatetime: new Date(),
    lastmodifiedby: '',
    lastmodifieddatetime: new Date(),    
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'workspacerelcontent',
  initialState,
  reducers: {
    getWorkspacerelcontents(state: WorkspacerelcontentState, action: PayloadAction<Workspacerelcontent[]>): void {
      state.workspacerelcontents = action.payload;
    },
    getWorkspacerelcontent(state: WorkspacerelcontentState, action: PayloadAction<Workspacerelcontent>): void {
      state.currentWorkspacerelcontent = action.payload;
    },
    createWorkspacerelcontent(state: WorkspacerelcontentState, action: PayloadAction<Workspacerelcontent>): void {
      state.workspacerelcontents.push(action.payload);
    },
    updateWorkspacerelcontent(state: WorkspacerelcontentState, action: PayloadAction<Workspacerelcontent>): void {
      const workspacerelcontent = action.payload;

      state.workspacerelcontents = state.workspacerelcontents.map((_workspacerelcontent) => {
        if (_workspacerelcontent.id === workspacerelcontent.id) {
          return workspacerelcontent;
        }

        return _workspacerelcontent;
      });
    },
    deleteWorkspacerelcontent(state: WorkspacerelcontentState, action: PayloadAction<Workspacerelcontent[]>): void {
      state.workspacerelcontents = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getWorkspacerelcontents =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspacerelcontent.ts:getWorkspacerelcontents');
    const data = await axiosInt.get('/api/workspacerelcontents'  )
    dispatch(slice.actions.getWorkspacerelcontents(data.data));
};

export const getWorkspacerelcontent =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspacerelcontent.ts:getWorkspacerelcontent');
    const data = await axiosInt.get('/api/workspacerelcontents/' + id)
    dispatch(slice.actions.getWorkspacerelcontent(data.data));
};

export const createWorkspacerelcontent =  
  (workspacerelcontent: any): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspacerelcontent.ts:createWorkspacerelcontent');
    try {
      const data = await axiosInt.post('/api/workspacerelcontents', workspacerelcontent)
      dispatch(slice.actions.getWorkspacerelcontents(data.data));
    /** 
      enqueueSnackbar('The workspacerelcontent account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    */
    } catch (err) {
      /** 
      enqueueSnackbar('Error in creating the workspacerelcontent', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
      **/
    }

  };

export const updateWorkspacerelcontent =
  (workspacerelcontent: Workspacerelcontent, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspacerelcontent.ts:updateWorkspacerelcontent');
    try {
      const data = await axiosInt.put('/api/workspacerelcontents/'+ workspacerelcontent.id, workspacerelcontent)
      dispatch(slice.actions.getWorkspacerelcontents(data.data));
      enqueueSnackbar('The workspacerelcontent account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the workspacerelcontent', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteWorkspacerelcontent =
  (workspacerelcontentId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/workspacerelcontents/'+ workspacerelcontentId)
      dispatch(slice.actions.getWorkspacerelcontents(data.data));
      enqueueSnackbar('The workspacerelcontent account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the workspacerelcontent', {
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
