import { useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ImportContentHeader from '@/content/techplaybook/content/ImportContent/ImportContent';
import ImportContentBody from '@/content/techplaybook/content/ImportContent/ImportContentBody';
import Footer from '@/components/Footer';

function ProjectEdit() {

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