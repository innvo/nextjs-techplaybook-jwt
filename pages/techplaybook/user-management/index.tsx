import { useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import PageHeader from 'src/content/techplaybook/user-management/PageHeader';
import Results from 'src/content/techplaybook/user-management/Results';
import { Grid} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { getUsers } from '@/slices/user';

function ManagementUsers() {

  const dispatch= useDispatch();  //ALI
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
   dispatch(getUsers()) ;
  }, []);

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
