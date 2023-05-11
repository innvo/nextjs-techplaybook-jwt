import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Tag } from 'src/models/tag';
import axiosInt from '@/utils/axios';
import { Zoom } from '@mui/material';

interface TagState {
  tags: Tag[];
  currentTag: Tag;
}


const initialState: TagState = {
  tags: [],
  currentTag: {
    id: 0,
    name: '',
    lastModifiedDate: ''
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    getTags(state: TagState, action: PayloadAction<Tag[]>): void {
      state.tags = action.payload;
    },
    getTag(state: TagState, action: PayloadAction<Tag>): void {
      state.currentTag = action.payload;
    },
    createTag(state: TagState, action: PayloadAction<Tag>): void {
      state.tags.push(action.payload);
    },
    updateTag(state: TagState, action: PayloadAction<Tag>): void {
      const tag = action.payload;

      state.tags = state.tags.map((_tag) => {
        if (_tag.id === tag.id) {
          return tag;
        }

        return _tag;
      });
    },
    deleteTag(state: TagState, action: PayloadAction<Tag[]>): void {
      state.tags = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getTags =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In tag.ts:getTags');
    const data = await axiosInt.get('/api/tags'  )
    dispatch(slice.actions.getTags(data.data));
};

export const getTag =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In tag.ts:getTag');
    const data = await axiosInt.get('/api/tags/id/' + id)
    dispatch(slice.actions.getTag(data.data));
};

export const createTag =  
  (tag: Tag, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In tag.ts:createTag');
    try {
      const data = await axiosInt.post('/api/tags', tag)
      dispatch(slice.actions.getTags(data.data));
      enqueueSnackbar('The tag account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the tag', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateTag =
  (tag: Tag, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In tag.ts:updateTag');
    try {
      const data = await axiosInt.put('/api/admin/tags', tag)
      dispatch(slice.actions.getTags(data.data));
      enqueueSnackbar('The tag account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the tag', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteTag =
  (tagId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/tags/'+ tagId)
      dispatch(slice.actions.getTags(data.data));
      enqueueSnackbar('The tag account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the tag', {
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
