import {
  FC,
  ChangeEvent,
  MouseEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef
} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Autocomplete,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  MenuItem,
  AvatarGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  TextField,
  Button,
  Typography,
  Dialog,
  FormControl,
  Select,
  InputLabel,
  Zoom,
  CardMedia,
  lighten,
  styled
} from '@mui/material';
import Link from 'src/components/Link';

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import { formatDistance, format } from 'date-fns';
import Text from 'src/components/Text';
import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event';

//------------------- ECHASIN
import { DataGridPro, GridRow, GridColumnHeaders, GridColDef } from '@mui/x-data-grid-pro';//ECHASIN
import {
  DataGridPremium,
  GridRenderCellParams,
  GridToolbar,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Chip, { ChipProps } from "@material-ui/core/Chip";
import { red, blue } from "@material-ui/core/colors";
import { options } from 'numeral';
import { getTags } from '@/slices/mailbox';
import { constrainPoint } from '@fullcalendar/common';

//----------------- ECHASIN

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const CardWrapper = styled(Card)(
  ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(['box-shadow'])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
    }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.75)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
);


interface ResultsProps {
  projects: Project[];
}

interface Filters {
  status?: ProjectStatus;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getProjectStatusLabel = (projectStatus: ProjectStatus): JSX.Element => {
  const map = {
    not_started: {
      text: 'Not started',
      color: 'error'
    },
    in_progress: {
      text: 'In progress',
      color: 'info'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    }
  };

  const { text, color }: any = map[projectStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  projects: Project[],
  query: string,
  filters: Filters
): Project[] => {
  return projects.filter((project) => {
    console.log("In applyfilters:");
    console.log("filters:", filters);
    console.log("filters.status:", filters.status);
    console.log("query:", query)
    console.log("query.length",query.length)
    
    let matches = true;

    if (filters){
      console.log("In filters")
    }

    if (filters.status == 'completed') {
      console.log("completed");
    }


    

    if (query) {
      console.log("In query")
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

     if (filters.status && project.projectstatus.name !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && project[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (
  projects: Project[],
  page: number,
  limit: number
): Project[] => {
  return projects.slice(page * limit, page * limit + limit);
};

//ECHASIN



const Results: FC<ResultsProps> = ({ projects }) => {
  console.log("In project>Results.tsx") //ECHASIN
  console.log("projects:", projects) //ECHASIN

  //----------------------------------------------------
  // DATA GRID ECHASIN
  // const columns: GridColDef[] = [
  //   { field: 'id', headerName: 'ID', width: 90 },
  //   {
  //     field: 'name',
  //     headerName: 'Name',
  //     width: 150,
  //     editable: true,
  //   },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     flex: 1,
  //     minWidth: 100,
  //     description: "Status",
  //     headerAlign: "left",
  //     renderCell: (params) => {
  //       return <Chip variant="outlined" size="small" {...getChipProps(params)} />;
  //     }
  //   },
  //   {
  //     field: "status1",
  //     headerName: "Status1",
  //     flex: 1,
  //     minWidth: 100,
  //     description: "Status1",
  //     headerAlign: "left",
  //     editable: true,
  //     renderCell: () => {
  //       return <Button
  //         variant="contained"
  //       >
  //         {t('Cancel')}
  //       </Button>;
  //     }
  //   },
  // ];

  // function getChipProps(params: GridRenderCellParams): ChipProps {
  //   if (params.value === "ACTIVE") {
  //     return {
  //       // icon: <WarningIcon style={{ fill: red[500] }} />,
  //       label: params.value,
  //       style: {
  //         borderColor: red[500]
  //       }
  //     };
  //   } else {
  //     return {
  //       icon: <CheckCircleIcon style={{ fill: blue[500] }} />,
  //       label: params.value,
  //       style: {
  //         borderColor: blue[500]
  //       }
  //     };
  //   }
  // }
  //----------------------------------------------------


  const [selectedItems, setSelectedProjects] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState([]); //ECHASIN

  const projectTags = [
    { title: 'Development' },
    { title: 'Design Project' },
    { title: 'Marketing Research' },
    { title: 'Software' }
  ];

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'not_started',
      name: t('Not started')
    },
    {
      id: 'completed',
      name: t('Completed')
    },
    {
      id: 'in_progress',
      name: t('In Progress')
    }
  ];

  /**
   * Search for project by name of records data table
   * @param {string} project name  (event.target.value)
   */
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("in handleQueryChange")
    event.persist();
    setQuery(event.target.value);
    console.log("setQuery(event.target.value):", event.target.value)
  };

  const handleTagChange = (event: ChangeEvent<{}>, value: any) => {
    console.log("in handleTagChange")
    console.log("options:", options)
    console.log("value:", value)
    event.persist();
    setSelectedTags(value);
    console.log("event.target.value:", event.target)
   
  };

  const handleTag1Change = (event, value) => {
    setSelectedTags(value);
    console.log('XXXX', value);
  };


  const handleSelect = event => {
    console.log("in handleSelect")
    //const selected = Array.from(event.target.selectedOptions, option => option.title);

    // setSelectedOptions(selected);
    //console.log("selected:", selected);
    console.log("options:", options);
    // console.log("getOptionLabel:", getOptionLabel )
  };







  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log("In handleStatusChange")
    let value = null;
  

    if (e.target.value == 'Completed') {
      console.log("Completed")
      value = e.target.value;
    }

    if (e.target.value !== 'all') {
      value = e.target.value;
      console.log("value:", value)
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllProjects = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProjects(
      event.target.checked ? projects.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (
    _event: ChangeEvent<HTMLInputElement>,
    projectId: string
  ): void => {
    if (!selectedItems.includes(projectId)) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => id !== projectId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProjects = applyFilters(projects, query, filters);
  console.log("filters:", filters)
  const paginatedProjects = applyPagination(filteredProjects, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProjects =
    selectedItems.length > 0 && selectedItems.length < projects.length;
  const selectedAllProjects = selectedItems.length === projects.length;

  const [toggleView, setToggleView] = useState<string | null>('table_view');

  const handleViewOrientation = (
    _event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setToggleView(newValue);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);



  /**
 * Deletes Project using Dialog Window
 * @param {number} project_id
 */
  const handleConfirmDelete = () => {
    console.log("in handleConfirmDelete")
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The projects has been deleted successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  return (
    <>
      {/* <p>DATA GRID SECTION</p>
      <Box sx={{ height: 520, width: '100%' }}>
        <DataGridPremium
          rows={projects}
          columns={columns}
          rowHeight={38}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          pagination
        />
      </Box>

    </> */}


      {/* ECHASIN */}
      <p><b>SEARCH SECTION</b></p>
      {/* < div>
      <select multiple={true} onChange={handleSelect}>
        <option value="apple">Apple</option>
        <option value="orange">Orange</option>
        <option value="banana">Banana</option>
        <option value="grapes">Grapes</option>
        <option value="watermelon">Watermelon</option>
      </select>
    </div> */}

<Autocomplete
      multiple
      value={selectedTags}
      onChange={handleTag1Change}
      options={projectTags}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder="Select tags..."
        />
      )}
    />

    <Box p={1}>
              <Autocomplete
                multiple
                sx={{
                  m: 0
                }}
                limitTags={2}
                // @ts-ignore
                onChange={handleSelect}
                getOptionLabel={(option) => option.title}
                options={projectTags}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Tags')}
                    placeholder={t('Select tags...')}
                  />
                )}
              />
            </Box>

      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder={t('Search by project name...')}
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            
     
            
            
            <Box p={1}>
              <Autocomplete
                multiple
                sx={{
                  m: 0
                }}
                limitTags={2}
                // @ts-ignore
                value={selectedTags}
                onChange={handleTagChange}
                options={projectTags}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Tags')}
                    placeholder={t('Select tags...')}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box p={1}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('Status')}</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label={t('Status')}
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            display="flex"
            justifyContent={{ xs: 'center', md: 'flex-end' }}
          >
            <Box p={1}>
              <ToggleButtonGroup
                value={toggleView}
                exclusive
                onChange={handleViewOrientation}
              >
                <ToggleButton disableRipple value="table_view">
                  <TableRowsTwoToneIcon />
                </ToggleButton>
                <ToggleButton disableRipple value="grid_view">
                  <GridViewTwoToneIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {toggleView === 'table_view' && (
        <Card>
          {/* ECHASIN */}
          <p><b>RESULTS TABLE SECTION</b></p>
          {selectedBulkActions && (
            <Box p={2}>
              <BulkActions />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('Showing')}:
                </Typography>{' '}
                <b>{paginatedProjects.length}</b> <b>{t('projects')}</b>
              </Box>
              <TablePagination
                component="div"
                count={filteredProjects.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>

          )}
          <Divider />

          {paginatedProjects.length === 0 ? (
            <>

              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {t(
                  "We couldn't find any projects matching your search criteria"
                )}
              </Typography>
            </>
          ) : (
            <>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllProjects}
                          indeterminate={selectedSomeProjects}
                          onChange={handleSelectAllProjects}
                        />
                      </TableCell>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Tags')}</TableCell>
                      <TableCell>{t('Time Left')}</TableCell>
                      <TableCell>{t('Members')}</TableCell>
                      <TableCell>{t('Progress')}</TableCell>
                      <TableCell>{t('Status')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProjects.map((project) => {
                      const isProjectSelected = selectedItems.includes(
                        project.id
                      );
                      return (
                        <TableRow
                          hover
                          key={project.id}
                          selected={isProjectSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project.name}
                            </Typography>
                          </TableCell>
                          {/* <TableCell>
                            {project.tags.map((value) => {
                              return (
                                <span key={value}>
                                  <Link href="#">{value}</Link>,{' '}
                                </span>
                              );
                            })}
                          </TableCell> */}
                          {/* <TableCell>
                            <Typography
                              noWrap
                              variant="subtitle1"
                              color="text.primary"
                            >
                              {t('Due')}
                              <b>
                                {' '}
                                {formatDistance(
                                  project.startDate,
                                  project.dueDate,
                                  {
                                    addSuffix: true
                                  }
                                )}
                              </b>
                            </Typography>
                            <Typography noWrap color="text.secondary">
                              {t('Started')}:{' '}
                              {format(project.dueDate, 'MMMM dd yyyy')}
                            </Typography>
                          </TableCell> */}
                          {/* <TableCell>
                            <Box display="flex" justifyContent="flex-start">
                              {project.memberIds.length > 0 && (
                                <AvatarGroup max={4}>
                                  {project.memberIds.map((member) => (
                                    <Tooltip
                                      arrow
                                      placement="top"
                                      key={member.id}
                                      title={member.name}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 30,
                                          height: 30
                                        }}
                                        key={member.id}
                                        src={member.avatar}
                                      />
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              )}
                            </Box>
                          </TableCell> */}
                          {/* <TableCell align="center">
                            <Box
                              sx={{
                                minWidth: 175
                              }}
                              display="flex"
                              alignItems="center"
                            >
                              <LinearProgress
                                sx={{
                                  flex: 1,
                                  mr: 1
                                }}
                                value={project.progress}
                                color="primary"
                                variant="determinate"
                              />
                              <Typography variant="subtitle1">
                                {project.progress}%
                              </Typography>
                            </Box>
                          </TableCell> */}
                          <TableCell>
                            {project.projectstatus.name}
                          </TableCell>
                          {/* <TableCell>
                            <Typography noWrap>
                              {getProjectStatusLabel(project.status)}
                            </Typography>
                          </TableCell> */}
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('View')} arrow>
                                <IconButton color="primary">
                                  <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={handleConfirmDelete}
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={filteredProjects.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box>
            </>
          )}
        </Card>
      )}
      {toggleView === 'grid_view' && (
        <>
          {paginatedProjects.length !== 0 && (
            <Card
              sx={{
                p: 2,
                mb: 3
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <>
                  <Box display="flex" alignItems="center">
                    <Tooltip
                      arrow
                      placement="top"
                      title={t('Select all projects')}
                    >
                      <Checkbox
                        checked={selectedAllProjects}
                        indeterminate={selectedSomeProjects}
                        onChange={handleSelectAllProjects}
                      />
                    </Tooltip>
                  </Box>
                  {selectedBulkActions && (
                    <Box flex={1} pl={2}>
                      <BulkActions />
                    </Box>
                  )}
                  {!selectedBulkActions && (
                    <TablePagination
                      component="div"
                      count={filteredProjects.length}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleLimitChange}
                      page={page}
                      rowsPerPage={limit}
                      rowsPerPageOptions={[5, 10, 15]}
                    />
                  )}
                </>
              </Box>
            </Card>
          )}
          {paginatedProjects.length === 0 ? (
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t("We couldn't find any projects matching your search criteria")}
            </Typography>
          ) : (
            <>
              <p><b>RESULTS GRID SECTION</b></p>
              <Grid container spacing={3}>
                {paginatedProjects.map((project) => {
                  const isProjectSelected = selectedItems.includes(project.id);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={project.name}>
                      <CardWrapper
                        className={clsx({
                          'Mui-selected': isProjectSelected
                        })}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: '2'
                          }}
                        >
                          <Box
                            pl={2}
                            py={1}
                            pr={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography component="span">
                                <b>{t('Tags')}:</b>{' '}
                              </Typography>
                              {project.tags.map((value) => {
                                return (
                                  <span key={value}>
                                    <Link href="#">{value}</Link>,{' '}
                                  </span>
                                );
                              })}
                            </Box>
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </Box>
                          <Divider />
                          <CardMedia
                            sx={{
                              minHeight: 180
                            }}
                            image={project.screenshot}
                          />
                          <Divider />
                          <Box p={2}>
                            {getProjectStatusLabel(project.status)}

                            <Typography
                              sx={{
                                mt: 2
                              }}
                              variant="h4"
                              gutterBottom
                            >
                              {project.name}
                            </Typography>

                            <Typography noWrap variant="subtitle2">
                              {project.description}
                            </Typography>
                          </Box>
                          <Box
                            px={2}
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography variant="subtitle2">
                                {t('Started')}:{' '}
                              </Typography>
                              <Typography variant="h5">
                                {format(project.dueDate, 'MMMM dd yyyy')}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">
                                {t('Due in')}:{' '}
                                <Text color="black">
                                  {formatDistance(
                                    project.startDate,
                                    project.dueDate,
                                    {
                                      addSuffix: true
                                    }
                                  )}{' '}
                                  days
                                </Text>
                              </Typography>
                            </Box>
                          </Box>

                          <Box px={2} pb={2} display="flex" alignItems="center">
                            <LinearProgress
                              sx={{
                                flex: 1,
                                mr: 1
                              }}
                              value={project.progress}
                              color="primary"
                              variant="determinate"
                            />
                            <Typography variant="subtitle1">
                              {project.progress}%
                            </Typography>
                          </Box>
                          <Divider />
                          <Box
                            p={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" justifyContent="flex-start">
                              {project.memberIds.length > 0 && (
                                <AvatarGroup max={4}>
                                  {project.memberIds.map((member) => (
                                    <Tooltip
                                      arrow
                                      placement="top"
                                      key={member.id}
                                      title={member.name}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 30,
                                          height: 30
                                        }}
                                        key={member.id}
                                        src={member.avatar}
                                      />
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              )}
                            </Box>
                            <Box>
                              <Button
                                sx={{
                                  mr: 1
                                }}
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                {t('Edit')}
                              </Button>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButtonError
                                  onClick={handleConfirmDelete}
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButtonError>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </CardWrapper>
                    </Grid>
                  );
                })}
              </Grid>
              <Card
                sx={{
                  p: 2,
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography component="span" variant="subtitle1">
                    {t('Showing')}
                  </Typography>{' '}
                  <b>{limit}</b> {t('of')} <b>{filteredProjects.length}</b>{' '}
                  <b>{t('projects')}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredProjects.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  labelRowsPerPage=""
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Card>
            </>
          )}
        </>
      )}
      {!toggleView && (
        <Card
          sx={{
            textAlign: 'center',
            p: 3
          }}
        >
          <Typography
            align="center"
            variant="h4"
            fontWeight="normal"
            color="text.secondary"
            sx={{
              my: 5
            }}
            gutterBottom
          >
            {t(
              'Choose between table or grid views for displaying the projects list.'
            )}
          </Typography>
        </Card>
      )}

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this project')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  projects: PropTypes.array.isRequired
};

Results.defaultProps = {
  projects: []
};

export default Results;
