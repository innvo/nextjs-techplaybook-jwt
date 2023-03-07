import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Zoom,
  Select
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from 'src/components/Text';
import Label from 'src/components/Label';
//ECHASIN
// import { User } from '@auth0/auth0-spa-js';
import type { User } from 'src/models/user';
// import { User } from '@auth0/auth0-spa-js';
 import { FC, useCallback, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { wait } from '@/utils/wait';
import { useSnackbar } from 'notistack';
import axiosInt from '@/utils/axios';


// //ECHASIN
interface ResultsProps {
  user: User
}

 const EditProfileTab: FC<ResultsProps> = ({ user }) => {  //ALI 20230305
//   //ECHASIN Results is the functional component
// }

//function EditProfileTab(): JSX.Element {
  //ECHASIN
 // console.log('In EditProfileTab')
  // console.log('props:', {props})


  const { t }: { t: any } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateUserSuccess = (user: any) => { //ALI 20230305
      try {
        axiosInt.put('/api/admin/users' , user).then(data => {   //ALI 20230305

        console.log(data.data)
        user=data.data;
        console.log(user)
        enqueueSnackbar(t('The user was updated successfully'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      });
      } catch (err) {
        console.error(err);
      }
  }

   //ALI 20230305
  return (
    <Formik
          initialValues={{
            id: user.id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            langKey: user.langKey,
            authorities: user.authorities,
            submit: null
          }}
          validationSchema={Yup.object().shape({
            login: Yup.string()
              .max(255)
              .required(t('The username field is required')),
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
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              await wait(1000);
           //   resetForm();
              setStatus({ success: true });
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
                    <Divider />
                    <CardContent
                      sx={{
                        p: 4
                      }}
                    >
                      <Typography variant="subtitle2">
                        <Grid container spacing={0}>
                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} sx={{ p: 2}}>
                            <Box pr={3} pb={2}>
                              {t('Login')}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9} sx={{ p: 1}}>
                            <Text color="black">
                              <TextField
                                    error={Boolean(touched.login && errors.login)}
                                    fullWidth
                                    helperText={touched.login && errors.login}
                                    name="login"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.login}
                                    variant="outlined"
                                  />
                            </Text>
                          </Grid>
                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} sx={{ p: 2}}>
                            <Box pr={3} pb={2}>
                              {t('First Name')}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9} sx={{ p: 1}}>
                            <Text color="black">
                              <TextField
                                    error={Boolean(touched.firstName && errors.firstName)}
                                    fullWidth
                                    helperText={touched.firstName && errors.firstName}
                                    name="firstName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    variant="outlined"
                                  />
                            </Text>
                          </Grid>
                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} sx={{ p: 2}}>
                            <Box pr={3} pb={2}>
                              {t('Last Name')}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9} sx={{ p: 1}}>
                            <Box
                              sx={{
                                maxWidth: { xs: 'auto', sm: 300 }
                              }}
                            >
                              <Text color="black">
                                <TextField
                                    error={Boolean(touched.lastName && errors.lastName)}
                                    fullWidth
                                    helperText={touched.lastName && errors.lastName}
                                    name="lastName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    variant="outlined"
                                  />
                                </Text>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} sx={{ p: 2}}>
                            <Box pr={3} pb={2}>
                              {t('Email')}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9} sx={{ p: 1}}>
                            <Box
                              sx={{
                                maxWidth: { xs: 'auto', sm: 300 }
                              }}
                            >
                              <Text color="black">
                                <TextField
                                    error={Boolean(touched.email && errors.email)}
                                    fullWidth
                                    helperText={touched.email && errors.email}
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    variant="outlined"
                                  />
                                </Text>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} sx={{ p: 2}}>
                            <Box pr={3} pb={2}>
                              {t('Roles')}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9} sx={{ p: 1}}>
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
                                  <option key="English" value="English">
                                      English
                                  </option>
                               
                            </Select>
                          </Grid>

                          <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }} sx={{ p: 2}}>
                            <Box pr={3} pb={2}>
                              {t('Roles')}:
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} md={9} sx={{ p: 1}}>
                            <Box
                              sx={{
                                maxWidth: { xs: 'auto', sm: 300 }
                              }}
                            >
                              <Select
                                  multiple
                                  native
                                  name='authorities'
                                  key='authorities'
                                  value={values.authorities}
                                  // @ts-ignore Typings are not considering `native`
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  inputProps={{
                                    id: 'select-multiple-native',
                                  }}
                                >
                                  <option key="ROLE_ADMIN" value="ROLE_ADMIN">
                                      ADMIN
                                  </option>
                                  <option key="ROLE_USER" value="ROLE_USER">
                                      USER
                                  </option>
                                  
                                  {/*
                                  {names.map((name) => (
                                    <option key={name} value={name}>
                                      {name}
                                    </option>
                                  ))}
                                  */}
                              </Select>
                            </Box>
                          </Grid>

                        </Grid>
                      </Typography>
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
                    </CardContent>                    
                  </Card>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
  );
}

export default EditProfileTab;
