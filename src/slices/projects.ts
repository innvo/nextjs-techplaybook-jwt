import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Project } from 'src/models/project';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface ProjectState {
  projects: Project[];
  currentProject: Project;
}


const initialState: ProjectState = {
  projects: [],
  currentProject: {
    id: 0,
    name: '',
    lastModifiedDate: ''
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    getProjects(state: ProjectState, action: PayloadAction<Project[]>): void {
      state.projects = action.payload;
    },
    getProject(state: ProjectState, action: PayloadAction<Project>): void {
      state.currentProject = action.payload;
    },
    createProject(state: ProjectState, action: PayloadAction<Project>): void {
      state.projects.push(action.payload);
    },
    updateProject(state: ProjectState, action: PayloadAction<Project>): void {
      const project = action.payload;

      state.projects = state.projects.map((_project) => {
        if (_project.id === project.id) {
          return project;
        }

        return _project;
      });
    },
    deleteProject(state: ProjectState, action: PayloadAction<Project[]>): void {
      state.projects = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getProjects =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In project.ts:getProjects');
    const data = await axiosInt.get('/api/projects/search'  )
    dispatch(slice.actions.getProjects(data.data));
};

export const getProject =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In project.ts:getProject');
    const data = await axiosInt.get('/api/projects/id/' + id)
    dispatch(slice.actions.getProject(data.data));
};

export const createProject =  
  (project: Project, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In project.ts:createProject');
    try {
      const data = await axiosInt.post('/api/projects', project)
      dispatch(slice.actions.getProjects(data.data));
      enqueueSnackbar('The project account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the project', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateProject =
  (project: Project, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In project.ts:updateProject');
    try {
      const data = await axiosInt.put('/api/admin/projects', project)
      dispatch(slice.actions.getProjects(data.data));
      enqueueSnackbar('The project account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the project', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteProject =
  (projectId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/projects/'+ projectId)
      dispatch(slice.actions.getProjects(data.data));
      enqueueSnackbar('The project account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the project', {
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
