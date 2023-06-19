import { useCallback, useState } from 'react';
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
  useTheme,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { useRouter } from 'next/router';
import { Content } from '@/models/content';
import { useDispatch } from '@/store';
import { createContent } from '@/slices/content';
import { useAuth } from '@/hooks/useAuth';

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

const UploadBox = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    background: ${theme.colors.alpha.trueWhite[10]};
`
);

const DividerContrast = styled(Divider)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
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

function ImportContentBody() {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter(); 
  const theme = useTheme();
  const dispatch = useDispatch();

  const { user }  = useAuth();


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

 



    const onDrop = useCallback((acceptedFiles) => {
      const regex = /data:.*base64,/
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {

          let binaryStr: any = reader.result         
          let newContent: Content = {
            title: file.name,
            istemplate: false,
            isfeatured: false,
            content_html: '',
            content_txt: '',
            content_summary: '',
            file: binaryStr.replace(regex,""),
            fileContentType: '',
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
            status: 'ACTIVE',
            createdby: user.login,
            createddatetime: Date.now(),
            lastmodifiedby: user.login,
            lastmodifieddatetime: Date.now(),
          }  

          dispatch(createContent(newContent, enqueueSnackbar));

        }
        //reader.readAsArrayBuffer(file)
        reader.readAsDataURL(file);

      })
      
    }, [])

    
    const {  
      acceptedFiles,
      isDragActive,
      isDragAccept,
      isDragReject,
      getRootProps, 
      getInputProps} = useDropzone({
      onDrop: onDrop,
    })



    const files = acceptedFiles.map((file, index) => (
      <ListItem disableGutters component="div" key={index}>
        <ListItemText primary={file.name} />
        <b>{file.size} bytes</b>
        <Divider />
      </ListItem>
    ));

    
  return (
    <>
       <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
         <Grid container spacing={0}>
            <Grid
                  item
                  xs={8}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Workspace')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={8}
                  sm={6}
                  md={4}
                  >
                    <FormControl fullWidth variant="outlined">                  
                      <InputLabel>{t('Workspace')}</InputLabel>
                      <Select
                       // value={JSON.stringify(projectBillingtype)} 
                       // defaultValue={JSON.stringify(projectBillingtype)}
                       // onChange={(e)=> setProjectBillingtype(JSON.parse(e.target.value))}
                       // onBlur={handleBlur}
                        label={t('Workspace')}
                      >
                         
                            <MenuItem key='{billingtypeOption.id}' value='{JSON.stringify(billingtypeOption)}'>
                              Workspace
                            </MenuItem>

                      </Select>
                    </FormControl>
                </Grid>
        </Grid>
         <Grid container spacing={0} >
            <Grid
                  item
                  xs={8}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Knowledgebase')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={8}
                  sm={6}
                  md={4}
                  >
                    <FormControl fullWidth variant="outlined">                  
                      <InputLabel>{t('Knowledgebase')}</InputLabel>
                      <Select
                       // value={JSON.stringify(projectBillingtype)} 
                       // defaultValue={JSON.stringify(projectBillingtype)}
                       // onChange={(e)=> setProjectBillingtype(JSON.parse(e.target.value))}
                       // onBlur={handleBlur}
                        label={t('Knowledgebase')}
                      >
                         
                            <MenuItem key='{billingtypeOption.id}' value='{JSON.stringify(billingtypeOption)}'>
                              Knowledgebase
                            </MenuItem>

                      </Select>
                    </FormControl>
                </Grid>
        </Grid>

        <Grid container spacing={0} pl={20}>
            <Grid
                  item
                  xs={12}
                  sm={8}
                  md={8}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
        <UploadBox>
          <BoxUploadWrapper {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <AvatarSuccess variant="rounded">
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drop the files to start uploading')}
                </Typography>
              </>
            )}
            {isDragReject && (
              <>
                <AvatarDanger variant="rounded">
                  <CloseTwoToneIcon />
                </AvatarDanger>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('You cannot upload these file types')}
                </Typography>
              </>
            )}
            {!isDragActive && (
              <>
                <AvatarWrapper variant="rounded">
                  <CloudUploadTwoToneIcon />
                </AvatarWrapper>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drag & drop files to add your work space and knowledge base (Optional) ')}
                </Typography>
              </>
            )}
          </BoxUploadWrapper>
          {files.length > 0 && (
            <>
              <Alert
                sx={{
                  py: 0,
                  mt: 2
                }}
                severity="success"
              >
                {t('You have uploaded')} <b>{files.length}</b> {t('files')}!
              </Alert>
              <DividerContrast
                sx={{
                  mt: 2
                }}
              />
              <List disablePadding component="div">
                {files}
              </List>
            </>
          )}
        </UploadBox>

        <Button
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('Brwose folder')}
        </Button>

        <Button
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('Brwose files')}
        </Button>
        
        <Button
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('enter web page url')}
        </Button>
        
        <Button
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('enter web url')}
        </Button>

        </Grid>
        </Grid>
      </Card>            
      
    </>
  );
}

export default ImportContentBody;
