import { useState, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditMyProfileTab from 'src/content/techplaybook/user-management/myProfile/EditMyProfileTab';
import SecurityTab from 'src/content/techplaybook/user-management/myProfile/SecurityTab';
import { useRouter } from 'next/router';
import { getUser } from '@/slices/user';
import { useDispatch } from '@/store';
import { useAuth } from '@/hooks/useAuth';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUsersView() {

  const router = useRouter(); 
  var id = router.query.userId;
  const { t }: { t: any } = useTranslation();
  const dispatch= useDispatch();  

  const { user }  = useAuth();


  const [currentTab, setCurrentTab] = useState<string>('edit_profile');

  const tabs = [
    { value: 'edit_profile', label: t('Edit Profile') },
    { value: 'security', label: t('Passwords/Security') }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  useEffect(() => {
    dispatch(getUser(+id)) ;
  }, [id]);

  if (!user) {
    return null;
  }
  return (
    <>
      <Head>
        <title> User Profile Details</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid
          sx={{ px: 4 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {/* ECHASIN */}
          {/* <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid>
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
           </Grid> */}

          <Grid item xs={12}>
            {/* //ECHASIN */}
            {/* <p> TEST</p> */}
            {/* {response.data.avatar} */}
           </Grid>

          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {/* //ECHASIN */}
            {/* {currentTab === 'activity' && <ActivityTab />} */}
            {currentTab === 'edit_profile' && <EditMyProfileTab user={user}/>}
            {currentTab === 'security' && <SecurityTab user={user}/>}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

ManagementUsersView.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementUsersView;