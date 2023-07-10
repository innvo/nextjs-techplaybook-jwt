import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Workspace } from 'src/models/workspace';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
}


const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: {
    id: 0,
    name: '',
    nameshort: '',
    description: '',
    status: '',
    createdby: '',
    createddatetime: new Date(),
    lastmodifiedby: '',
    lastmodifieddatetime: new Date(),
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    getWorkspaces(state: WorkspaceState, action: PayloadAction<Workspace[]>): void {
      state.workspaces = action.payload;
    },
    getWorkspace(state: WorkspaceState, action: PayloadAction<Workspace>): void {
      state.currentWorkspace = action.payload;
    },
    createWorkspace(state: WorkspaceState, action: PayloadAction<Workspace>): void {
      state.workspaces.push(action.payload);
    },
    updateWorkspace(state: WorkspaceState, action: PayloadAction<Workspace>): void {
      const workspace = action.payload;

      state.workspaces = state.workspaces.map((_workspace) => {
        if (_workspace.id === workspace.id) {
          return workspace;
        }

        return _workspace;
      });
    },
    deleteWorkspace(state: WorkspaceState, action: PayloadAction<Workspace[]>): void {
      state.workspaces = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getWorkspaces =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspace.ts:getWorkspaces');
    const data = await axiosInt.get('/api/workspaces'  )
    dispatch(slice.actions.getWorkspaces(data.data));
};

export const getWorkspace =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspace.ts:getWorkspace');
    const data = await axiosInt.get('/api/workspaces/' + id)
    dispatch(slice.actions.getWorkspace(data.data));
};

export const createWorkspace =  
  (workspace: any, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspace.ts:createWorkspace');
    try {
      const data = await axiosInt.post('/api/workspaces', workspace)
      dispatch(slice.actions.getWorkspaces(data.data));
      enqueueSnackbar('The workspace account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the workspace', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateWorkspace =
  (workspace: Workspace, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In workspace.ts:updateWorkspace');
    try {
      const data = await axiosInt.put('/api/workspaces/'+ workspace.id, workspace)
      dispatch(slice.actions.getWorkspaces(data.data));
      enqueueSnackbar('The workspace account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the workspace', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteWorkspace =
  (workspaceId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/workspaces/'+ workspaceId)
      dispatch(slice.actions.getWorkspaces(data.data));
      enqueueSnackbar('The workspace account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the workspace', {
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
