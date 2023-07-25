import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import {
  Button,
  styled,
  Autocomplete,
  TextField,
  Grid,
  Card,
  useTheme,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TableContainer,
  Stack,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Checkbox
} from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useTranslation } from 'next-i18next';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '@/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import { Content } from '@/models/content';
import { useDispatch, useSelector } from '@/store';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { GridDeleteIcon } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';

import { Tag } from '@/models/tag';


// Rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


// CSS

const EditorWrapper = styled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);


// Data

// functional component

interface ResultsProps {
  content: Content;
}

 // function BasicTabs() {
const TabProfilePanel: React.FC<ResultsProps> = ({ content }) => {

  

  
  return (
    <>
   
  
  </>
  )
}
export default TabProfilePanel;

