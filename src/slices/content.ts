import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { Content } from 'src/models/content';
import axiosInt from '@/utils/axios';
import { Fab, Zoom } from '@mui/material';

interface ContentState {
  contents: Content[];
  currentContent: Content;
}


const initialState: ContentState = {
  contents: [],
  currentContent: {
    id: 0,
    title: '',
    istemplate: false,
    isfeatured: false,
    content_html: '',
    content_txt: '',
    content_summary: '',
    file: '',
    fileContentType: '',
    content_metadata: '',
    processing_metadata: '',
    processing_status: '',
    embedding_status: '',
    embedding_metadata: '',
    description: '',
    url: '',
    authors: '',
    datepublished: 0,
    poststartdatetime: 0,
    postenddatetime: 0,
    preview_image_small: '',
    preview_image_smallContentType: '',
    preview_image_medium: '',
    preview_image_mediumContentType: '',
    preview_image_large: '',
    preview_image_largeContentType: '',
    content_contentclass: '',
    content_community: '',
    content_parent: '',
    content_contentpoststatus: '',
    content_contentstatus: '',
    content_forum: '',
    content_project: '',
    content_poststarttimezone_timezone: '',
    content_postendtimezone_timezone: '',
    status: '',
    createdby: '',
    createddatetime: 0,
    lastmodifiedby: '',
    lastmodifieddatetime: 0,
    domain: ''
  }  
};

//Initialize slice
const slice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    getContents(state: ContentState, action: PayloadAction<Content[]>): void {
      state.contents = action.payload;
    },
    getContent(state: ContentState, action: PayloadAction<Content>): void {
      state.currentContent = action.payload;
    },
    createContent(state: ContentState, action: PayloadAction<Content>): void {
      state.contents.push(action.payload);
    },
    updateContent(state: ContentState, action: PayloadAction<Content>): void {
      const content = action.payload;

      state.contents = state.contents.map((_content) => {
        if (_content.id === content.id) {
          return content;
        }

        return _content;
      });
    },
    deleteContent(state: ContentState, action: PayloadAction<Content[]>): void {
      state.contents = action.payload;
    }
  }
});


// The reducer function is destructured from the slice object and exported using the ES6 shorthand syntax. This makes it easy to import the reducer function in another file by using:

export const { reducer } = slice;

export const getContents =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In content.ts:getContents');
    const data = await axiosInt.get('/api/contents'  )
    dispatch(slice.actions.getContents(data.data));
};

export const getContent =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In content.ts:getContent');
    const data = await axiosInt.get('/api/contents/' + id)
    dispatch(slice.actions.getContent(data.data));
};

export const createContent =  
  (content: Content,enqueueSnackbar,router): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In content.ts:createContent');
    try {
      const data = await axiosInt.post('/api/contents', content)

      dispatch(slice.actions.getContents(data.data));

      enqueueSnackbar('The content account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
      router.push('/techplaybook/content/edit/'+ data.data.id);

    
    } catch (err) {
      enqueueSnackbar('Error in creating the content', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const importCreateContent =  
  (formData: FormData,enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In content.ts:createContent');
    try {
      const data = await axiosInt.post('/api/contents/import', formData)

      dispatch(slice.actions.getContents(data.data));

      enqueueSnackbar('The content account was created successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in creating the content', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }

  };

export const updateContent =
  (content: Content, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    console.log('In content.ts:updateContent');
    try {
      const data = await axiosInt.put('/api/contents/'+ content.id, content)
      dispatch(slice.actions.getContents(data.data));
      enqueueSnackbar('The content account was updated successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in updating the content', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    }
};

export const deleteContent =
  (contentId: number, enqueueSnackbar): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const data = await axiosInt.delete('/api/contents/'+ contentId)
      dispatch(slice.actions.getContents(data.data));
      enqueueSnackbar('The content account was deleted successfully', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    
    } catch (err) {
      enqueueSnackbar('Error in deleting the content', {
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
