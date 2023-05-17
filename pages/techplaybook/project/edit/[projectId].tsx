
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

function ProjectEdit() {

  const router = useRouter(); 
  var id = router.query.projectId;
  const dispatch= useDispatch();  

  const project = useSelector((state) => state.project.currentProject);

  useEffect(() => {
    dispatch(getProject(+id)) ;
  }, [id]);
 
  return (
   
    <>
    <Head>
      <title>Project Edit</title>
    </Head>
    <PageTitleWrapper>
        <PageHeader />
    </PageTitleWrapper>
      <ProjectEditContent project={project} />
       
  </>
  );
}

ProjectEdit.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ProjectEdit;