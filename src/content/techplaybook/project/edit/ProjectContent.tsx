import { Fragment, ChangeEvent, useState, useEffect } from 'react';
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


/// Functional Component
function ProjectContent() {
  const { t }: { t: any } = useTranslation();

  // State
  const [currentTab, setCurrentTab] = useState<string>('profile');

  // Data
  const tabs = [
    { value: 'profile', label: t('Profile') },
    { value: 'team', label: t('Team Members') },
    { value: 'objectives', label: t('Objectives') },
    { value: 'releases', label: t('Releases') },
    { value: 'requirements', label: t('Requirements') }
  ];


  // Functions
  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
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
  <TabPanel />
 </Grid>

      <Grid item xs={12}>
        <TabsContainerWrapper>
          <Tabs
            onChange={handleTabsChange}
            value={currentTab}
            variant="scrollable"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </TabsContainerWrapper>
        {/* <FilterOptions>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12} lg={6} md={6}>
              <Autocomplete
                multiple
                sx={{ m: 2 }}
                limitTags={2}
                options={assignees}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Avatar sx={{ mr: 1 }} src={option.avatar} />
                    {option.name}
                  </li>
                )}
                // @ts-ignore
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    label={t('Assigned')}
                    placeholder={t('Select assignees...')}
                  />
                )}
                renderTags={(assignees, getTagProps) =>
                  assignees.map((ev, index: number) => (
                    <Chip
                      key={ev.name}
                      label={ev.name}
                      {...getTagProps({ index })}
                      avatar={<Avatar src={ev.avatar} />}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
              <Autocomplete
                sx={{ m: 2 }}
                limitTags={2}
                autoHighlight
                options={sprints}
                renderOption={(props, option) => (
                  <Fragment key={option.name}>
                    <li {...props}>
                      <Box flex={1} py={1}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          pb={1}
                        >
                          <Typography variant="h5">{option.name}</Typography>
                          <Label color="success">{option.progress}%</Label>
                        </Box>

                        <LinearProgressWrapper
                          value={option.progress}
                          color="primary"
                          variant="determinate"
                        />
                      </Box>
                    </li>
                    <Divider />
                  </Fragment>
                )}
                // @ts-ignore
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    label={t('Sprint')}
                    placeholder={t('Select sprint...')}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FilterOptions> */}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <h1>TEST</h1>
      <TabPanel />
      </Grid>

      {/* <Grid item xs={12}>
        <TasksWrapperContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <TasksWrapper>
              {lists.allIds.map((listId: string) => (
                <Results key={listId} listId={listId} />
              ))}

              <Tooltip arrow title={t('Add a new project panel')}>
                <CardAddAction>
                  <CardActionArea sx={{ px: 1 }}>
                    <CardContent>
                      <AvatarAddWrapper>
                        <AddTwoToneIcon fontSize="large" />
                      </AvatarAddWrapper>
                    </CardContent>
                  </CardActionArea>
                </CardAddAction>
              </Tooltip>
            </TasksWrapper>
          </DragDropContext>
        </TasksWrapperContent>
      </Grid> */}
    </Grid>
  );
}

export default ProjectContent;
