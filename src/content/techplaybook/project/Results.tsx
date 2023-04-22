import {
  FC,
  ChangeEvent,
  useState
} from 'react';
import {
  Avatar,
  Autocomplete,
  Box,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Button,
  Typography,
  Dialog,
  FormControl,
  Select,
  InputLabel,
  Zoom,
  lighten,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid,
  GridRowHeightParams,
  GridToolbarContainer,
  GridRowSelectionModel, GridToolbarDensitySelector,
  } from '@mui/x-data-grid';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';

/**
 * Creates a styled Dialog component using the styled-components library.
 * The DialogWrapper component is a custom Dialog with modified styles
 * applied to the MuiDialog-paper class.
*/
const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);
/**
 * Creates a styled Avatar component using the styled-components library.
 * The AvatarError component is a custom Avatar with modified styles
 * based on the theme provided.
 */
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

/**
 * Creates a styled Card component using the styled-components library.
 * The CardWrapper component is a custom Card with modified styles
 * based on the theme provided.
 */
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

/**
 * Creates a styled Button component using the styled-components library.
 * The ButtonError component is a custom Button with modified styles
 * based on the theme provided.
 */
const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);
/**
 * Creates a styled IconButton component using the styled-components library.
 * The IconButtonError component is a custom IconButton with modified styles
 * based on the theme provided.
 */
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

/**
 * ResultsProps is a TypeScript interface that represents the type of properties
 * for a React component that displays a list of projects.
 * @typedef {Object} ResultsProps
 * @property {Project[]} projects - An array of projects, where each project is an object of type Project.
 */;
interface ResultsProps {
  projects: Project[];
}

/**
 * Filters is a TypeScript interface that represents the type of filter criteria
 * to be applied to a list of projects. The filters are optional.
 * @typedef {Object} Filters
 * @property {ProjectStatus} [status] - An optional property representing the status filter of a project.
 */
interface Filters {
  status?: ProjectStatus;
}


/**
 * getProjectStatusLabel is a function that takes a project status value and
 * returns a JSX Element containing the corresponding status label text and color.
 * @function
 * @param {ProjectStatus} projectStatus - The project status value to be mapped to a label and color.
 * @returns {JSX.Element} - A JSX Element containing the label text and color based on the project status value.
 */
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
};


/**
 * Filters an array of projects based on the provided query and filters.
 *
 * @param {Project[]} projects - An array of projects, where each project is an object of type Project.
 * @param {string} query - A query string that can be used to filter the projects.
 * @param {Filters} filters - An object containing the filter criteria to be applied to the projects.
 * @returns {Project[]} - A filtered array of projects.
 */
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
    console.log("query.length", query.length)

    if (filters) {
      console.log("In filters")
    }

    if (filters.status == 'completed') {
      console.log("completed");
    }
  })
};





const Results: FC<ResultsProps> = ({ projects }) => {
 
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({ status: null });
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] =  useState<GridRowSelectionModel>([]);
  
  console.log("In project>Results.tsx")
  console.log("projects:", projects) 
  console.log("rowSelectionModel:", rowSelectionModel) 
  /**
 * An array of project tag objects, each containing a title representing a tag associated with a project.
 * 
 * @type {Array<Object>}
 * @property {string} title - The title of the project tag.
 */
  const projectTags = [
    { title: 'Development' },
    { title: 'Design Project' },
    { title: 'Marketing Research' },
    { title: 'Software' }
  ];

  /**
   * An array of status option objects, each containing an id and a name representing a project status.
   * The names are translated using the 't' function from the 'useTranslation' hook.
   * 
   * @type {Array<Object>}
   * @property {string} id - The identifier of the project status option.
   * @property {string} name - The translated name of the project status option.
   */

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

  /**
  * Search for project by tag of records data table
  * @param {string} project name  (event.target.value)
  */
  const handleTagChange = (event: ChangeEvent<{}>, value: any) => {
    console.log("in handleTagChange")
    console.log("value:", value)
    event.persist();
    setSelectedTags(value);
    console.log("event.target.value:", event.target)

  };

  /**
   * Handles changes in the status filter by updating the `filters` state based on the selected value.
   * 
   * @function
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the status filter input element.
   * @returns {void}
   */
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log("In handleStatusChange")
    let value = null;

    // If the selected value is 'Completed', set the value variable accordingly
    if (e.target.value == 'Completed') {
      console.log("Completed")
      value = e.target.value;
    }
    // If the selected value is not 'all', set the value variable accordingly
    if (e.target.value !== 'all') {
      value = e.target.value;
      console.log("value:", value)
    }
    // Update the 'filters' state with the new status filter value
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  // const filteredProjects = applyFilters(projects, query, filters);
  // console.log("filters:", filters)

  /**
   * @typedef {Object} anchorOrigin
   * @property {string} vertical - The vertical position of the snackbar.
   * @property {string} horizontal - The horizontal position of the snackbar.
   */

  /**
   * State variable and function to manage the visibility of the confirm delete dialog.
   * @type {Array}
   * @property {boolean} openConfirmDelete - The state that determines the visibility of the confirm delete dialog.
   * @property {function} setOpenConfirmDelete - The function to update the openConfirmDelete state.
   */
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
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

  /**
 * `columns` is an array of column definitions to be used in a data grid.
 * It contains definitions for the ID and project name columns.
 * @type {Array}
 * @property {Object} column - An object representing a column definition.
 * @property {string} column.field - The field identifier for the column.
 * @property {string} column.headerName - The header name to display for the column.
 * @property {number} column.width - The width of the column.
 * @property {boolean} [column.editable] - Optional property specifying if the column is editable. Defaults to true.
 */
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Project name',
      width: 150,
      editable: false,
    },
  ];
  
  /**
 * CustomToolbar is a React functional component that renders a custom toolbar
 * for a data grid, containing a density selector.
 * @function
 * @returns {ReactElement} - A GridToolbarContainer element containing a GridToolbarDensitySelector.
 */
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  }
  
  


  return (
    <>
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
              {/* <ToggleButtonGroup
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
              </ToggleButtonGroup> */}
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <>
          {/* <TableContainer> */}
          <Box p={1} sx={{ height: 600, width: '100%' }}>
            {/* DataGrid version 6 */}
            <DataGrid
              rows={projects}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5,10,25,50,100]}
              checkboxSelection
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              slots={{
                toolbar: CustomToolbar,
              }}
            />
            {/* </TableContainer> */}
          </Box>
        </>
      </Card>
      {/* )} */}


      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
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

// Results.propTypes = {
//   projects: PropTypes.array.isRequired
// };

// Results.defaultProps = {
//   projects: []
// };

export default Results;
