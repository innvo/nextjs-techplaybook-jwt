import * as React from 'react';
import {
  alpha,
  Button,
  styled,
  Tabs,
  Tooltip,
  Tab,
  CardActionArea,
  CardContent,
  Avatar,
  Autocomplete,
  TextField,
  Chip,
  Grid,
  Divider,
  Typography,
  Card,
  Paper,
  LinearProgress,
  Zoom,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Block1 from './Block1';
import Block2 from './Block2';





// CSS


// Data

// functional component
function TabProfilePanel() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  return (
    <>
    {/* <Head>
      <title>Analytics Dashboard</title>
    </Head>
    <PageTitleWrapper>
      <PageHeader />
    </PageTitleWrapper> */}
    <Grid
      sx={{
        px: 4
      }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={4}
    >
      <Grid item lg={8} xs={12}>
        <Card>
          <p>Project Details goes here</p>
        </Card>
      </Grid>
      <Grid item lg={4} xs={12}>
      <Card>
          <p>Project Actions goes here</p>
        </Card>
      </Grid>
       <Grid item md={12} xs={12}>
        <Card>
        <p>DataGrid goes here</p>
        </Card>
      </Grid>
    </Grid>
  
  </>
  )
}
export default TabProfilePanel;

