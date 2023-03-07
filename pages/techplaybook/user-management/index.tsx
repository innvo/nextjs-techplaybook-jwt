import { useState, useEffect, useCallback } from 'react';

import Head from 'next/head';

import axiosInt from 'src/utils/axios';//ECHASIN

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';

import PageHeader from 'src/content/techplaybook/user-management/PageHeader';
import Results from 'src/content/techplaybook/user-management/Results';

import { Grid} from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';

import type { User } from 'src/models/user';
//import { usersApi } from 'src/mocks/users';

function ManagementUsers() {

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
      const response = await axiosInt.get('/api/users/')
      if (isMountedRef()) {
        const users = response.data;
        //this.setState({ users });
        setUsers(response.data);
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
          {/* ECHASIN     */}
          {/* {users.map(user => <li key={user.id}>{user.id} {user.login}</li>)} */}
          <Results users={users} />
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
