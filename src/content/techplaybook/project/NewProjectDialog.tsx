import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Formik } from 'formik';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import DatePicker from '@mui/lab/DatePicker';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  styled,
  TextField,
  Typography,
  useTheme, 
  Zoom
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { wait } from 'src/utils/wait';
import * as Yup from 'yup';

//   import api from '../services/api';
interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

// CSS
const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
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

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

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

// Rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Data 
const projectTags = [
  { title: 'Development' },
  { title: 'Design Project' },
  { title: 'Marketing Research' },
  { title: 'Software' }
];


// Functional Component
  function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
  console.log('In src/content/techplaybook/project/NewProjectDialog.tsx')
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  //const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<Date | null>(null); //Datepicker


  // Dropzone
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

// Functions
  const handleCreateProject = async () => {
    try {
      // TO BE REPLACED BY REAL REST CALL
      // const response = await api.post('/projects', {
      //   name,
      //   description,
      // });

      // console.log('Project created:', response.data);
      setName('');
      setDescription('');
      handleCreateProjectSuccess();  //Only on Project Insert
      onClose();
  
    } catch (error) {
      console.error('Error creating project:', error);
   
    }
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar(t('A new project has been created successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    // setOpen(false); ECHASIN
  };

  const handleCreateProjectCancel = () => {
    console.log("In src/content/techplaybook/project/NewProjectDialog.tsx/ handleCreateProjectCancel")
    onClose();
    // setOpen(false); ECHASIN
  };

  return (
    // <Dialog open={open} onClose={onClose}>
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Create new project')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Use this dialog window to add a new project')}
        </Typography>
      </DialogTitle>
      <Formik
        initialValues={{
          name: '',
          nameshort: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3)
            .max(100)
            .required(t('The name field is required'))
        })}
        onSubmit={async (
          _values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            await wait(1000);
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            handleCreateProjectSuccess();
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent
              dividers
              sx={{
                p: 3
              }}
            >
              <Grid container spacing={0}>
                <Grid
                  item
                  xs={12}
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
                    <b>{t('Project Name')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    name="name"
                    placeholder={t('Project name here...')}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box
                    pr={3}
                    sx={{
                      pb: { xs: 1, md: 0 }
                    }}
                  >
                    <b>{t('Description')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <EditorWrapper>
                    <ReactQuill />
                  </EditorWrapper>
                </Grid>
                <Grid
                  item
                  xs={12}
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
                    <b>{t('Tags')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Autocomplete
                    multiple
                    sx={{
                      m: 0
                    }}
                    limitTags={2}
                    // @ts-ignore
                    getOptionLabel={(option) => option.title}
                    options={projectTags}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        placeholder={t('Select project tags...')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box
                    pr={3}
                    sx={{
                      pb: { xs: 1, md: 0 }
                    }}
                  >
                    <b>{t('Upload files')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
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
                          {t('Drag & drop files here')}
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
                        {t('You have uploaded')} <b>{files.length}</b>{' '}
                        {t('files')}!
                      </Alert>
                      <Divider
                        sx={{
                          mt: 2
                        }}
                      />
                      <List disablePadding component="div">
                        {files}
                      </List>
                    </>
                  )}
                </Grid>
                {/* <Grid
                  item
                  xs={12}
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
                    <b>{t('Members')}:</b>
                  </Box>
                </Grid> */}
                {/* <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Autocomplete
                    multiple
                    sx={{
                      m: 0
                    }}
                    limitTags={2}
                    // @ts-ignore
                    getOptionLabel={(option) => option.title}
                    options={members}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Avatar
                          sx={{
                            mr: 1
                          }}
                          src={option.avatar}
                        />
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        placeholder={t('Select project members...')}
                      />
                    )}
                    renderTags={(members, getTagProps) =>
                      members.map((ev, index: number) => (
                        <Chip
                          key={ev.name}
                          label={ev.name}
                          {...getTagProps({ index })}
                          avatar={<Avatar src={ev.avatar} />}
                        />
                      ))
                    }
                  />
                </Grid> */}
                <Grid
                  item
                  xs={12}
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
                    <b>{t('Due Date')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <DatePicker
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        placeholder={t('Select due date...')}
                        {...params}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  textAlign={{ sm: 'right' }}
                />
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Button
                    sx={{
                      mr: 2
                    }}
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                    size="large"
                    onClick={handleCreateProject}
                  >
                    {t('Create project')}
                  </Button>
                  <Button
                    color="secondary"
                    size="large"
                    variant="outlined"
                    onClick={handleCreateProjectCancel}
                  >
                    {t('Cancel')}
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

export default NewProjectDialog;