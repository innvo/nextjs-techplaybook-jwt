
import { useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/techplaybook/content/new/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import NewContent from '@/content/techplaybook/content/new/NewContent';
import Footer from '@/components/Footer';

function ProjectEdit() {

  useEffect(() => {
  }, []);
 
  return (
   
    <>
    <Head>
      <title>Content Edit</title>
    </Head>
    <PageTitleWrapper>
        <PageHeader />
    </PageTitleWrapper>
    <NewContent />
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