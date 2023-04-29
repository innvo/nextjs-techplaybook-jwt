import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  Button,
  styled,
  DialogActions,
  CircularProgress
} from '@mui/material';
import Head from 'next/head';
import BaseLayout from 'src/layouts/BaseLayout';
import { Guest } from 'src/components/Guest';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useDispatch } from '@/store';
import { useSnackbar } from 'notistack';
import { wait } from '@/utils/wait';
import { resetPassword } from '@/slices/user';


const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function RecoverPasswordBasic() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch= useDispatch();

  var key = router.query.key;

  const handleUserPasswordSuccess = (keyAndPasswordVM: any) => {
    dispatch(resetPassword(keyAndPasswordVM, enqueueSnackbar, router));
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <MainContent>
        <Container maxWidth="sm">
          <Logo />
          <Card
            sx={{
              mt: 3,
              p: 4
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 1
                }}
              >
                {t('Reset Password')}
              </Typography>
            </Box>
            <Formik
            initialValues={{
              key: key,
              newPassword: '',
              confirmPassword: '',
              submit: null
            }}
            enableReinitialize
            validationSchema={Yup.object().shape({
              newPassword: Yup.string()
                .max(255)
                .min(6)
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
                      <Box ml={2}>
                      
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
                             
                      </Box>
                      <DialogActions
                        sx={{
                          p: 4
                        }}
                      >
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
                 
              </form>
            )}
          </Formik>
          </Card>
          <Box mt={3} textAlign="right">
            <Typography
              component="span"
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
            >
              {t('Want to try to sign in again?')}
            </Typography>{' '}
            <Link href={'/'} >
              <b>Click here</b>
            </Link>
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

RecoverPasswordBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default RecoverPasswordBasic;
