import { useState, useEffect, useCallback } from 'react';

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Users/PageHeader';
import Footer from 'src/components/Footer';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import type { User } from 'src/models/user';
//import { usersApi } from 'src/mocks/users';

import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from 'src/content/Management/Users/Results';

import axios from 'axios'; //ECHASIN
import axiosInt from 'src/utils/axios';//ECHASIN
function ManagementUsers() {
  console.log('In users-management/index.ts');


  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState<User[]>([]);

  const response = axiosInt.get('http://localhost:8080/api/users')
    .then(response => {
      // Handle response
      console.log('response.data:', response.data);
    })
    .catch(err => {
      // Handle errors
      console.error(err);
    });

  console.log('response:', response)



  // const getUsers = useCallback(async () => {
  //   try {
  //     //const response = await usersApi.getUsers();
  //     const response = axiosInt.get('http://localhost:8080/api/users')
  //     .then(response => {
  //       // Handle response
  //       console.log('response.data:', response.data);
  //     })
  //     .catch(err => {
  //       // Handle errors
  //       console.error(err);
  //     });
  //     if (isMountedRef()) {
  //       setUsers(response);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  // useEffect(() => {
  //   getUsers();
  // }, [getUsers]);

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          {/* <Results users={users} /> */}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementUsers.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementUsers;
