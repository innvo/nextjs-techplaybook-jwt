import { useState, useEffect, useCallback } from 'react';

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/Management/Users/PageHeader';
import Footer from 'src/components/Footer';

import { Grid, useForkRef } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import type { User } from 'src/models/user';
//import { usersApi } from 'src/mocks/users';

import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from 'src/content/Management/Users/Results';

import axios, { AxiosResponse } from 'axios'; //ECHASIN
import axiosInt from 'src/utils/axios';//ECHASIN
function ManagementUsers() {
  console.log('In users-management/index.ts');


  const isMountedRef = useRefMounted();
  //const [users, setUsers] = useState<User[]>([]);
  //const [users, setUsers] = useState<AxiosResponse | null>(null);// ECHASIN FIXES ERROR
  const [users, setUsers] = useState<User[]>([]);
  // TO BE REMOVED
  // const response = axiosInt.get('http://localhost:8080/api/users')
  //   .then(response => {
  //     // Handle response
  //     console.log('response.data:', response.data);
  //     const users = response.data;
  //   })
  //   .catch(err => {
  //     // Handle errors
  //     console.error(err);
  //   });

  const getUsers = useCallback(async () => {
    try {
      //const response = await usersApi.getUsers(); ECHASIN MOCK API
      console.log('In getUsers')
      const response = await axiosInt.get('http://localhost:8080/api/users')
      if (isMountedRef()) {
        const users = response.data;
        //this.setState({ users });
        setUsers(response.data);
        console.log('getUsers-response.data:', response.data)
        console.log('users;', users)
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

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
          <h1>Return Data Here</h1>
          
            {users.map(user => <li key={user.id}>{user.id} {user.login}</li>)}
          
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
