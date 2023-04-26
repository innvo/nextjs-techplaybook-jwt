import { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  DialogActions,
  Grid,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { User } from '@/models/user';
import * as Yup from 'yup';
import { wait } from '@/utils/wait';
import { useRouter } from 'next/router';
import { changePassword } from '@/slices/user';
import { useDispatch } from '@/store';
import { useSnackbar } from 'notistack';
import PasswordStrengthBar from 'react-password-strength-bar';

interface UserProps {
  user: User
}

const SecurityTab: FC<UserProps> = ({ user }) => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar();
  const dispatch= useDispatch();
 
  const handleUserPasswordSuccess = (user: any) => {
    dispatch(changePassword(user, enqueueSnackbar));
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
        </Box>
        <Card>
          <Formik
            initialValues={{
              id: user.id,
              newPassword: '',
              confirmPassword: '',
              submit: null
            }}
            enableReinitialize
            validationSchema={Yup.object().shape({
              newPassword: Yup.string()
                .max(255)
                .required(t('The password field is required')),
              confirmPassword: Yup.string()
                .max(255)
                .required(t('The confirm password field is required'))
                .oneOf([Yup.ref('newPassword')], 'Passwords does not match'),
            })}


            onSubmit={async (
              _values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                await wait(1000);
                setStatus({ success: true });
                handleUserPasswordSuccess(_values);
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
                            {t('Change Password')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('You can change your password here')}
                          </Typography>
                        </Box>
                      </Box>
                      <Box ml={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} lg={7}>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <TextField
                                  type='password'
                                  error={Boolean(touched.newPassword && errors.newPassword)}
                                  fullWidth
                                  helperText={touched.newPassword && errors.newPassword}
                                  label={t('New Password')}
                                  name="newPassword"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.newPassword}
                                  variant="outlined"
                                />
                                <PasswordStrengthBar password={values.newPassword} />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  type='password'
                                  error={Boolean(
                                    touched.confirmPassword && errors.confirmPassword
                                  )}
                                  fullWidth
                                  helperText={touched.confirmPassword && errors.confirmPassword}
                                  label={t('New Password Confirmation')}
                                  name='confirmPassword'
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  variant="outlined"
                                />
                              </Grid>                             
                            </Grid>
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
                          {t('Update Password')}
                        </Button>
                      </DialogActions>
                    </Card>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
          
        </Card>
      </Grid>
    

    </Grid>
  );
}

export default SecurityTab;
