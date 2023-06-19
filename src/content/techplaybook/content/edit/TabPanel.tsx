import * as React from 'react';
import {
  styled,
  Tabs,
  Tooltip,
  Tab,
  CardActionArea,
  CardContent,
  Grid,
  Avatar,
  Box,
  Autocomplete,
  TextField,
  Chip,
  Divider,
  Typography,
  Card,
  LinearProgress,
  Zoom
} from '@mui/material';

import TabProfilePanel from './profile/TabProfilePanel';
import TabTeamPanel from './profile/TabTeamPanel';
import { Project } from '@/models/project';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}



// CSS
const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
      padding: 0 ${theme.spacing(2)};
      position: relative;
      bottom: -1px;

      .MuiTabs-root {
        height: 44px;
        min-height: 44px;
      }

      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          min-height: 4px;
          height: 4px;
          box-shadow: none;
          bottom: -4px;
          background: none;
          border: 0;

          &:after {
            position: absolute;
            left: 50%;
            width: 28px;
            content: ' ';
            margin-left: -14px;
            background: ${theme.colors.primary.main};
            border-radius: inherit;
            height: 100%;
          }
      }

      .MuiTab-root {
          &.MuiButtonBase-root {
              height: 44px;
              min-height: 44px;
              background: ${theme.colors.alpha.white[50]};
              border: 1px solid ${theme.colors.alpha.black[10]};
              border-bottom: 0;
              position: relative;
              margin-right: ${theme.spacing(1)};
              font-size: ${theme.typography.pxToRem(13)};
              color: ${theme.colors.alpha.black[80]};
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;

              .MuiTouchRipple-root {
                opacity: .1;
              }

              &:after {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                content: '';
                background: ${theme.colors.alpha.black[10]};
              }

              &:hover {
                color: ${theme.colors.alpha.black[100]};
              }
          }

          &.Mui-selected {
              color: ${theme.colors.alpha.black[100]};
              background: ${theme.colors.alpha.white[100]};
              border-bottom-color: ${theme.colors.alpha.white[100]};

              &:after {
                height: 0;
              }
          }
      }
  `
);


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface ResultsProps {
  project: Project
}

 // function BasicTabs() {
const BasicTabs: React.FC<ResultsProps> = ({ project }) => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid
      sx={{ px: 4 }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item xs={12}>
        <TabsContainerWrapper>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Profile" {...tabProps(0)} />
            <Tab label="Team Members" {...tabProps(1)} />
            <Tab label="Objectives" {...tabProps(2)} />
            <Tab label="Releases" {...tabProps(3)} />
            <Tab label="Requirements" {...tabProps(4)} />
            <Tab label="Checklists" {...tabProps(5)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <TabProfilePanel project={project}></TabProfilePanel>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
            <TabTeamPanel></TabTeamPanel>
          </TabPanel><TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={3}>
            Item Four
          </TabPanel><TabPanel value={value} index={4}>
            Item Five
          </TabPanel><TabPanel value={value} index={5}>
            Item Six
          </TabPanel>
        </TabsContainerWrapper>
      </Grid>
    </Grid>
  );
}
export default  BasicTabs;