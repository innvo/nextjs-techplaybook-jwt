import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { wait } from 'src/utils/wait';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import axiosInt from '@/utils/axios';//ECHASIN

import NewContentDialog from '../NewContentDialog';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  Divider,
  Alert,
  Chip,
  DialogContent,
  Box,
  Zoom,
  ListItem,
  List,
  ListItemText,
  Typography,
  TextField,
  CircularProgress,
  Avatar,
  Autocomplete,
  Button,
  useTheme
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { useRouter } from 'next/router';

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);

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

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const ContentTags = [
  { title: 'Development' },
  { title: 'Design Content' },
  { title: 'Marketing Research' },
  { title: 'Software' }
];

function ImportContentHeader() {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter(); 

  // const theme = useTheme();

  // const members = [
  //   {
  //     avatar: '/static/images/avatars/1.jpg',
  //     name: 'Maren Lipshutz'
  //   },
  //   {
  //     avatar: '/static/images/avatars/2.jpg',
  //     name: 'Zain Vetrovs'
  //   },
  //   {
  //     avatar: '/static/images/avatars/3.jpg',
  //     name: 'Hanna Siphron'
  //   },
  //   {
  //     avatar: '/static/images/avatars/4.jpg',
  //     name: 'Cristofer Aminoff'
  //   },
  //   {
  //     avatar: '/static/images/avatars/5.jpg',
  //     name: 'Maria Calzoni'
  //   }
  // ];

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg']
    }
  });

  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));

  const [value, setValue] = useState<Date | null>(null);

  const handleCreateContentOpen = () => {
    console.log("In src/content/techplaybook/Content/PageHeader.tsx/ handleCreateContentOpen")
    setOpen(true);
  };

  const handleCreateContentClose = () => {
    console.log("In src/content/techplaybook/Content/PageHeader.tsx/ handleCreateContentClose")
    setOpen(false);
  };

  const importContent = () => {
    router.push('/techplaybook/content/importcontent');
 };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Content Sources')}
          </Typography>
        </Grid>
      </Grid>
      
    </>
  );
}

export default ImportContentHeader;
