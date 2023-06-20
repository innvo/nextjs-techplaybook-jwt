
// function ProjectEdit() {
    
//     return <h1>Edit Project</h1>;

// }
// export default ProjectEdit

import { useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/techplaybook/project/edit/PageHeader';
// src
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from '@/store';
import ProjectEditContent from '@/content/techplaybook/project/edit/ProjectEdit';
import { getProject } from '@/slices/projects';
import ImportContent from '@/content/techplaybook/content/ImportContent/ImportContent';
import ImportContentHeader from '@/content/techplaybook/content/ImportContent/ImportContent';
import ImportContentBody from '@/content/techplaybook/content/ImportContent/ImportContentBody';
import Footer from '@/components/Footer';

function ProjectEdit() {

  const router = useRouter(); 
  const dispatch= useDispatch();  

  const project = useSelector((state) => state.project.currentProject);

  useEffect(() => {
  }, []);
 
  return (
   
    <>
    <Head>
      <title>import content</title>
    </Head>
    <PageTitleWrapper>
       <ImportContentHeader></ImportContentHeader>
    </PageTitleWrapper>
    <ImportContentBody></ImportContentBody>
    <Footer />       
  </>
  );
}

ProjectEdit.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ProjectEdit;