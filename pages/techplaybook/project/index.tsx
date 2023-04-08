import Head from 'next/head';

import { useState, useEffect, useCallback } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from 'src/content/techplaybook/project/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';
// import { projectsApi } from 'src/mocks/projects'; //ECHASIN
import Results from 'src/content/techplaybook/project/Results';

import axiosInt from '@/utils/axios';//ECHASIN


function Projects() {
  console.log("In Project.index.ts"); //ECHASIN
  const isMountedRef = useRefMounted();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = useCallback(async () => {
    try {
      const response = await axiosInt.get('/api/projects');

      if (isMountedRef()) {
        setProjects(response.data);
        console.log('response.data:', response.data)
      }
    } catch (err) {
      console.error('Error getting projects:', err);
    }
  }, [isMountedRef]);

  return (
    <>
      <Head>
        <title>Projects </title>
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
          {/* <Results projects={projects} /> */}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

Projects.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default Projects;


