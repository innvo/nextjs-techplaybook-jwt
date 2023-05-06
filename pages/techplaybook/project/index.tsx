import Head from 'next/head';

import { useState, useEffect, useCallback } from 'react';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import PageHeader from '@/content/techplaybook/project/PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import type { Project } from 'src/models/project';

import axiosInt from '@/utils/axios';//ECHASIN
import Results from '@/content/techplaybook/project/Results';//ECHASIN
import { useDispatch, useSelector } from '@/store';
import { getProject } from '@/slices/projects_board';
import { getProjects } from '@/slices/projects';

function Projects() {
  console.log("In Project.index.ts"); //ECHASIN
  const isMountedRef = useRefMounted();
  //const [projects, setProjects] = useState<Project[]>([]);

  /**
 * Initializes the component by fetching project data using the `getProjects` function.
 * Runs only once on component mount due to the empty dependency array.
 *
 * @function
 * @effect
 * @returns {void}
 */


  const dispatch= useDispatch();  
  const projects = useSelector((state) => state.project.projects);

  useEffect(() => {
   dispatch(getProjects('Dolor Industries','rest','Completed')) ;
  }, []);

/**
 * Fetches project data from the '/api/projects' endpoint using Axios and updates the `projects` state.
 * Ensures that the component is still mounted before setting the state to avoid memory leaks.
 *
 * @function
 * @async
 * @callback
 * @param {function} isMountedRef - A reference function to check if the component is still mounted.
 * @returns {void}
 * @throws Will throw an error if the request fails or the component is unmounted.
 */
  

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
          <Results projects={projects} />
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


