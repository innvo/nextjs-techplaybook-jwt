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
    dispatch(resetPassword(keyAndPasswordVM, enqueueSnackbar));
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>success reset password</title>
      </Head>
      <MainContent
       sx={{
        mt: 1,
        pb: 30
      }} >
        <Container maxWidth="sm">
          <Logo />
          <Card
            sx={{
              mt: 10,
              p: 4
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 1
                }}
              >
                {t('Your Password has been reset successfully.')}
              </Typography>
            </Box>
          </Card>
          <Box mt={3} textAlign="right">
            <Typography
              component="span"
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
            >
              {t('Want to sign in?')}
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
