import { useState, useCallback, ChangeEvent, useEffect } from 'react';

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import Footer from 'src/components/Footer';

import { Box, Tabs, Tab, Grid, styled } from '@mui/material';

import type { User } from 'src/models/user';

import { useRefMounted } from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

import EditProfileTab from 'src/content/techplaybook/user-management/profile/EditProfileTab';
import NotificationsTab from 'src/content/Management/Users/single/NotificationsTab';
import SecurityTab from 'src/content/Management/Users/single/SecurityTab';

//ECHASIN
import { useRouter } from 'next/router';
import axiosInt from 'src/utils/axios';


const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUsersView() {
  //ECHASIN User Info
 
  
  //ECHASIN Url Info
    const router = useRouter(); 
    var id = router.query.userId;
   // console.log("router:", router)
    //console.log("router.query.id:", id)

  const isMountedRef = useRefMounted();
  const [user, setUser] = useState<User | null>(null);
  const { t }: { t: any } = useTranslation();

  const [currentTab, setCurrentTab] = useState<string>('edit_profile');

  const tabs = [
    //ECHASIN
    // { value: 'activity', label: t('Activity') },
    { value: 'edit_profile', label: t('Edit Profile') },
    { value: 'notifications', label: t('Notifications') },
    { value: 'security', label: t('Passwords/Security') }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const getUsers = useCallback(async () => {   //ALI 20230305
    try {
      //ECHASIN
      console.log('In getUser')
      //API retreiving by login needs to be changed
      const response = await axiosInt.get('/api/admin/users/id/' + id);   //ALI 20230305
      console.log("response:", response.data.avatar)

      if (isMountedRef()) {
        setUser(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUsers();
  }, [id]);  //ALI 20230305

  //ECHASIN
//   decodeBase64(base64data) {
//     let base64ToString = Buffer.from(base64data, "base64").toString()
//     this.setState({data: base64ToString })
// }


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
            <p> TEST</p>
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
            {currentTab === 'edit_profile' && <EditProfileTab user={user}/>}
            {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />}
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
