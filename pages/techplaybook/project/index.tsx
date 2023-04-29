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

function Projects() {
  console.log("In Project.index.ts"); //ECHASIN
  const isMountedRef = useRefMounted();
  const [projects, setProjects] = useState<Project[]>([]);

  /**
 * Initializes the component by fetching project data using the `getProjects` function.
 * Runs only once on component mount due to the empty dependency array.
 *
 * @function
 * @effect
 * @returns {void}
 */
  useEffect(() => {
    console.log("In index.tsx>useEffect")
    // Call the 'getProjects' function to fetch project data
    getProjects();
  }, []); // The empty dependency array ensures this effect runs only once on component mount


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
  const getProjects = useCallback(async () => {
    try {
      // Send a GET request to the '/api/projects' endpoint
      console.log("In project>index.tsx>getProjects")
      const response = await axiosInt.get('/api/projects');
      // Check if the component is still mounted before updating the state
      if (isMountedRef()) {
        // Update the 'projects' state with the received data
        setProjects(response.data);
        console.log('response.data:', response.data)
      }
    } catch (err) {
      // Log any error encountered during the request
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


