import { Fragment, ChangeEvent, useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
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
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import TabPanel from '@/content/techplaybook/project/edit/TabPanel';
import { Project } from '@/models/project';

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

// Interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ResultsProps {
  project: Project
}

// Functional Component
const ProjectEdit: FC<ResultsProps> = ({ project }) => {

  const { t }: { t: any } = useTranslation();
  
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
        <TabPanel project={project}></TabPanel>
      </Grid>

    </Grid>
  );
}

export default ProjectEdit;
