import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Knowledgebase } from 'src/models/knowledgebase';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface KnowledgebaseState {
  knowledgebases: Knowledgebase[];
  currentKnowledgebase: Knowledgebase;
}


const initialState: KnowledgebaseState = {
  knowledgebases: [],
  currentKnowledgebase: {
    id: 0,
    name: '',
    nameshort: '',
    description: '',
    status: '',
    createdby: '',
    createddatetime: 0,
    lastmodifiedby: '',
    lastmodifieddatetime: 0,
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'knowledgebase',
  initialState,
  reducers: {
    getKnowledgebases(state: KnowledgebaseState, action: PayloadAction<Knowledgebase[]>): void {
      state.knowledgebases = action.payload;
    },
    getKnowledgebase(state: KnowledgebaseState, action: PayloadAction<Knowledgebase>): void {
      state.currentKnowledgebase = action.payload;
    },
    createKnowledgebase(state: KnowledgebaseState, action: PayloadAction<Knowledgebase>): void {
      state.knowledgebases.push(action.payload);
    },
    updateKnowledgebase(state: KnowledgebaseState, action: PayloadAction<Knowledgebase>): void {
      const knowledgebase = action.payload;

      state.knowledgebases = state.knowledgebases.map((_knowledgebase) => {
        if (_knowledgebase.id === knowledgebase.id) {
          return knowledgebase;
        }

        return _knowledgebase;
      });
    },
    deleteKnowledgebase(state: KnowledgebaseState, action: PayloadAction<Knowledgebase[]>): void {
      state.knowledgebases = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getKnowledgebases =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In knowledgebase.ts:getKnowledgebases');
    const data = await axiosInt.get('/api/knowledgebases'  )
    dispatch(slice.actions.getKnowledgebases(data.data));
};

export const getKnowledgebase =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In knowledgebase.ts:getKnowledgebase');
    const data = await axiosInt.get('/api/knowledgebases/' + id)
    dispatch(slice.actions.getKnowledgebase(data.data));
};

export const createKnowledgebase =  
  (knowledgebase: any, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In knowledgebase.ts:createKnowledgebase');
    try {
      const data = await axiosInt.post('/api/knowledgebases', knowledgebase)
      dispatch(slice.actions.getKnowledgebases(data.data));
      enqueueSnackbar('The knowledgebase account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the knowledgebase', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateKnowledgebase =
  (knowledgebase: Knowledgebase, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In knowledgebase.ts:updateKnowledgebase');
    try {
      const data = await axiosInt.put('/api/knowledgebases/'+ knowledgebase.id, knowledgebase)
      dispatch(slice.actions.getKnowledgebases(data.data));
      enqueueSnackbar('The knowledgebase account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the knowledgebase', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteKnowledgebase =
  (knowledgebaseId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/knowledgebases/'+ knowledgebaseId)
      dispatch(slice.actions.getKnowledgebases(data.data));
      enqueueSnackbar('The knowledgebase account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the knowledgebase', {
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
