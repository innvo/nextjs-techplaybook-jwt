import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { wait } from 'src/utils/wait';
import { useAuth } from 'src/hooks/useAuth';

import {
  styled,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Zoom,
  Typography,
  Divider,
  TextField,
  CircularProgress,
  Switch,
  Avatar,
  Autocomplete,
  IconButton,
  Button,
  Select
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import axiosInt from '@/utils/axios';
import { useRouter } from 'next/router';
import ManagementUsers from 'pages/management/users';
import { createUser } from '@/slices/user';
import { useDispatch } from '@/store';

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Box)(
  ({ theme }) => `

    position: relative;

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};
    bottom: -${theme.spacing(2)};
    right: -${theme.spacing(2)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);


function PageHeader() {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch= useDispatch();

  const [publicProfile, setPublicProfile] = useState({
    public: true
  });

  const handlePublicProfile = (event) => {
    setPublicProfile({
      ...publicProfile,
      [event.target.name]: event.target.checked
    });
  };

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };
 
  const handleCreateUserSuccess = (user: any) => {
    dispatch(createUser(user, enqueueSnackbar));
    setOpen(false);
  }

  const [avatar, setAvatar] =  useState<any>();

  function readFileDataAsBase64(e) {
    const file = e.currentTarget.files[0];

    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsDataURL(file);
        
    }).then(function(result: string) {
      const regex = /data:.*base64,/
      setAvatar( result.replace(regex,""))
   });;
  }

  const saveAvatar = (event) => {
     readFileDataAsBase64(event);
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Users Management')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'All aspects related to the app users can be managed from this page'
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateUserOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create user')}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Add new user')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to create and add a new user to the site'
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            id: '',
            login: '',
            firstName: '',
            lastName: '',
            email: '',
            langKey: 'English',
            activated: true,
            jobtitle: '',
            avatar: '',
            authorities: null,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            login: Yup.string()
              .max(255)
              .required(t('The login field is required'))
              .test('Unique Login','Login already in use', 
              function(value){return new Promise((resolve, reject) => {
                  axiosInt.get('/api/admin/users/check/login/'+ value)
                  .then(res => {if(res.data === true){resolve(false)} resolve(true)})
              })}
            ),
            firstName: Yup.string()
              .max(255)
              .required(t('The first name field is required')),
            lastName: Yup.string()
              .max(255)
              .required(t('The last name field is required')),
            email: Yup.string()
              //.email(t('The email provided should be a valid email address'))
              .max(255)
              .required(t('The email field is required'))
              //ECHASIN 
              .test('Unique Email','Email already in use', 
              function(value){return new Promise((resolve, reject) => {
                  axiosInt.get('/api/admin/users/check/email/'+ value)
                  .then(res => {if(res.data === true){resolve(false)} resolve(true)})
              })}
            ),
              
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
              _values.avatar=avatar;
              console.log(_values)
              handleCreateUserSuccess(_values);
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
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={7}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.login && errors.login)}
                          fullWidth
                          helperText={touched.login && errors.login}
                          label={t('Login')}
                          name="login"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.login}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(
                            touched.firstName && errors.firstName
                          )}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          label={t('First name')}
                          name="firstName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.lastName && errors.lastName)}
                          fullWidth
                          helperText={touched.lastName && errors.lastName}
                          label={t('Last name')}
                          name="lastName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.email && errors.email)}
                          fullWidth
                          helperText={touched.email && errors.email}
                          label={t('Email address')}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="email"
                          value={values.email}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                          native
                          fullWidth
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.langKey}
                          name='langKey'
                          inputProps={{
                            id: 'select-multiple-native',
                          }}
                        >
                          <option key="English" value="en">
                            English
                          </option>
                          <option key="Spanish" value="es">
                            Spanish
                          </option>

                        </Select>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Select
                          multiple
                          fullWidth
                          native
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.authorities == null ? []: values.authorities}
                          name='authorities'
                          inputProps={{
                            id: 'select-multiple-native',
                          }}
                        >
                          {/* ECHASIN this need to be retrieved from database */}
                          <option key="ADMIN" value="ROLE_ADMIN">
                            ADMIN
                          </option>
                          <option key="USER" value="ROLE_USER">
                            USER
                          </option>
                        </Select>

                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={5} justifyContent="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                      mt={3}
                    >
                      <AvatarWrapper>
                        <Avatar
                          variant="rounded"
                          // alt={user.name}
                          src={`data:image/jpg;base64,${avatar}`}
                        />
                        <ButtonUploadWrapper>
                          <Input
                            accept="image/*"
                            id="icon-button-file"
                            name="avatar"
                            type="file"
                            //value={avatar}
                            onChange ={(event) => {saveAvatar(event)}}
                          />
                          <label htmlFor="icon-button-file">
                            <IconButton component="span" color="primary">
                              <CloudUploadTwoToneIcon />
                            </IconButton>
                          </label>
                        </ButtonUploadWrapper>
                      </AvatarWrapper>
                      <Divider
                        flexItem
                        sx={{
                          m: 4
                        }}
                      />
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            pb: 1
                          }}
                        >
                          {t('Active User')}
                        </Typography>
                        <Switch
                          checked={values.activated}
                          onChange={handleChange}
                          name="activated"
                          color="primary"
                        />
                      </Box>

                      {/* <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            pb: 1
                          }}
                        >
                          {t('Public Profile')}
                        </Typography>
                        <Switch
                          checked={publicProfile.public}
                          onChange={handlePublicProfile}
                          name="public"
                          color="primary"
                        />
                      </Box> */}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button color="secondary" onClick={handleCreateUserClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Add new user')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
