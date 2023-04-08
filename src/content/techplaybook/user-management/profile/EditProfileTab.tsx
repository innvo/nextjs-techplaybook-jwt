import {
  Avatar,
  Button,
  Grid,
  Typography,
  Card,
  Box,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  styled,
  Switch,
  Select,
  DialogActions,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { User } from 'src/models/user';
import { FC, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { wait } from '@/utils/wait';
import { useSnackbar } from 'notistack';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import { useRouter } from 'next/router';
import { useDispatch } from '@/store';
import { updateUser } from '@/slices/user';
import axiosInt from '@/utils/axios';


//ECHASIN
interface ResultsProps {
  user: User
}

//ECHASIN
const AvatarWrapper = styled(Box)(
  ({ theme }) => `

    position: relative;

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

//ECHASIN
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

//ECHASIN
const Input = styled('input')({
  display: 'none'
});

const EditProfileTab: FC<ResultsProps> = ({ user }) => {

  const router = useRouter()
 
  const [activated, setActivated] = useState(user.activated);

  const handleChangeActivated = (event) => {
    setActivated(event.target.checked);
  };

  const { t }: { t: any } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch= useDispatch();

  const [avatar, setAvatar] =  useState<any>('');

  const [validImage, setValidImage] =  useState<boolean>(false);

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
      var img: HTMLImageElement;
      img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = function () {
      
      if (img.width && img.height > 200) {
        setValidImage(false);

      }
      else {
        const regex = /data:.*base64,/
        setAvatar( result.replace(regex,""))
        setValidImage(true)
       }
    };
      
   });;
}

  const saveAvatar = (event) => {
     readFileDataAsBase64(event);
  }

  const handleUpdateUserSuccess = (user: any) => {
    dispatch(updateUser(user, enqueueSnackbar));
  }

  useEffect(() => {
    setAvatar(user.avatar);
    setActivated(user.activated);
   }, [user]);

  return (

    <Formik
      initialValues={{
        id: user.id,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        langKey: user.langKey,
        activated: user.activated,
        jobtitle: user.jobtitle,
        avatar: user.avatar,
        authorities: user.authorities,
        submit: null
      }}
      enableReinitialize
      validationSchema={Yup.object().shape({
        login: Yup.string()
          .max(255)
          .required(t('The Login field is required'))
          .test('Unique Login','Login already in use', 
              function(value){return new Promise((resolve, reject) => {
                  axiosInt.get('/api/admin/users/check/login/'+ value)
                  .then(res => {if(res?.data.id === user.id || res?.data.id === undefined ){resolve(true)} resolve(false)})
              })}
           ),
        firstName: Yup.string()
          .max(255)
          .required(t('The first name field is required')),
        lastName: Yup.string()
          .max(255)
          .required(t('The last name field is required')),
        email: Yup.string()
          .email(t('The email provided should be a valid email address'))
          .max(255)
          .required(t('The email field is required'))
          .test('Unique Email','Email already in use', 
              function(value){return new Promise((resolve, reject) => {
                  axiosInt.get('/api/admin/users/check/email/'+ value)
                  .then(res => {if(res?.data.id === user.id || res?.data.id === undefined ){resolve(true)} resolve(false)})
              })}
          ),
        avatar: Yup.string()
           .test('len', 'Max size is 200x200  pixels', val => validImage === true)
      })}


      onSubmit={async (
        _values,
        { setErrors, setStatus, setSubmitting }
      ) => {
        try {
          await wait(1000);
          setStatus({ success: true });
          _values.avatar=avatar;
          _values.activated=activated;
          handleUpdateUserSuccess(_values);
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <Box
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {t('Personal Details')}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t('Manage informations related to your personal details')}
                    </Typography>
                  </Box>
                </Box>
                <Box ml={2}>
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
                        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                        <InputLabel shrink htmlFor="select-multiple-native">
                          {t('Language')}
                        </InputLabel>
                          <Select
                            native
                            fullWidth
                            onBlur={handleBlur}
                            label={t('Language')}
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
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                          <InputLabel shrink htmlFor="select-multiple-native">
                          {t('Roles')}
                          </InputLabel>
                          <Select
                            multiple
                            fullWidth
                            native
                            label={t('ROles')}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.authorities}
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
                          </FormControl>
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
                                                <Typography  color='error'>{errors.avatar}</Typography>

                        <AvatarWrapper>
                          <Avatar
                            variant="rounded"
                            // alt={user.name}
                            src={`data:image/jpg;base64,${avatar}`}
                          />
                          <ButtonUploadWrapper>
                            <Input
                              accept="image/jpg,image/jpeg"
                              id="icon-button-file"
                              name="avatar"
                              type="file"
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
                            checked={activated}
                            onChange={handleChangeActivated}
                            name="activated"
                            color="primary"
                          />
                        </Box>
                        {/* ECHASIN */}
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
                </Box>
                <DialogActions
                  sx={{
                    p: 4
                  }}
                >
                  {/* <Button color="secondary" onClick={handleCreateUserClose}> */}
                   <Button color="secondary" onClick={() => router.back()}> 
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
                    {t('Update user')}
                  </Button>
                </DialogActions>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

export default EditProfileTab;
