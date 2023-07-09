
// function ProjectEdit() {
    
//     return <h1>Edit Project</h1>;

// }
// export default ProjectEdit

import { useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/techplaybook/content/edit/PageHeader';
// src
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from '@/store';
import EditContent from '@/content/techplaybook/content/edit/EditContent';
import { getContent } from '@/slices/content';
import Footer from '@/components/Footer';

function ProjectEdit() {

  const router = useRouter(); 
  var id = router.query.contentId;
  const dispatch= useDispatch();  

  const content = useSelector((state) => state.content.currentContent);

  useEffect(() => {
    dispatch(getContent(+id)) ;
  }, [id]);
 
  return (
   
    <>
    <Head>
      <title>Content Edit</title>
    </Head>
    <PageTitleWrapper>
        <PageHeader />
    </PageTitleWrapper>
    <EditContent content={content} />
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