import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import {
  Grid,
  Typography
} from '@mui/material';

function ImportContentHeader() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Content Sources')}
          </Typography>
        </Grid>
      </Grid>      
    </>
  );
}

export default ImportContentHeader;
