
// function ProjectEdit() {
    
//     return <h1>Edit Project</h1>;

// }
// export default ProjectEdit

import { useState, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Footer from 'src/components/Footer';
import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import PageHeader from 'src/content/techplaybook/project/edit/PageHeader';
// src
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';
import EditProfileTab from 'src/content/techplaybook/user-management/profile/EditProfileTab';
import SecurityTab from    'src/content/techplaybook/user-management/profile/SecurityTab';
import { useRouter } from 'next/router';
import { getUser } from '@/slices/user';
import { useDispatch, useSelector } from '@/store';
import ProjectContent from '@/content/techplaybook/project/edit/ProjectEdit';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ProjectEdit() {

 
  return (
   
    <>
    <Head>
      <title>Project Edit</title>
    </Head>
    <PageTitleWrapper>
        <PageHeader />
    </PageTitleWrapper>
      <ProjectContent />
       
  </>
  );
}

ProjectEdit.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ProjectEdit;