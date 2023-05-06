
import * as React from 'react';
import {
  FC,
  ChangeEvent,
  useState,
  useEffect
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGridPro, GridActionsCellItem, GridRowId, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid-pro';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { TableContainer } from '@material-ui/core';

import type { Project } from 'src/models/project';
import { useSnackbar } from 'notistack';
import { useDispatch } from '@/store';
import { deleteProject } from '@/slices/projects';


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
 * ResultsProps is a TypeScript interface that represents the type of properties
 * for a React component that displays a list of projects.
 * @typedef {Object} ResultsProps
 * @property {Project[]} projects - An array of projects, where each project is an object of type Project.
 */;
interface ResultsProps {
  projects: Project[];
}

const Results: FC<ResultsProps> = ({ projects }) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState('');
  const [projectStatusName, setProjectStatusName] = useState('');
  const [rows, setRows] = useState(projects);
  const [selectedProjectId, setSelectedProjectId] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  // THIS MUST BE SET FROM DATABASE
  /**
 * An array of project tag objects, each containing a title representing a tag associated with a project.
 */
  const projectTags = ['jhipster', 'rest', 'agile'];

  // THIS MUST BE SET FROM DATABASE
  /**
  * An array of project status objects, each containing a name representing a status associated with a project.
  */
  const statusOptions = [
    {
      id: 'all',
      name: 'all'
    },
    {
      id: 'Not started',
      name: t('Not started')
    },
    {
      id: 'Completed',
      name: t('Completed')
    },
    {
      id: 'In Progress',
      name: t('In Progress')
    }
  ];


  useEffect(() => {
    setRows(projects);
  }, [projects]);


  /**
   * Edit Project
 */
  const editProject = (id: GridRowId) => {
    // Add your project deletion logic here
  };

  /**
   * Delete Project
 */
  const handleDeleteProject = (id: number) => {
    setSelectedProjectId(id);
    setOpenConfirmDelete(true);
  };

  /**
   * Search Datagrid
   *    handleNameChang
   *  handleStatusChange
   *    newSelectedTags
   */

  const handleNameChange = (searchValue) => {
    setProjectName(searchValue.target.value);
  };
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setProjectStatusName(e.target.value);
  };
  let newSelectedTags = [];
  const handleTagChange = (searchValue) => {
    if (selectedTags.includes(searchValue.target.innerText)) {
      let index = selectedTags.indexOf(searchValue.target.innerText);
      selectedTags.splice(index, 1);
    } else {
      newSelectedTags = [...selectedTags, searchValue.target.innerText]
    }
    setSelectedTags(newSelectedTags)
  };

  /**
   * Delete functions
   * State variable and function to manage the visibility of the confirm delete dialog.
   */
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };
  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);
    dispatch(deleteProject(selectedProjectId, enqueueSnackbar));
  };

  /**
 * `columns` is an array of column definitions to be used in a data grid.
 * It contains definitions for the ID and project name columns.
 */
  const columns = [
    { field: 'projectId', headerName: 'ID', width: 90 },
    {
      field: 'projectName',
      headerName: 'Project name',
      width: 400,
      editable: false,
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 250,
      renderCell: (cellValues) => (
        <Stack direction="row" spacing={0.25}>
          {cellValues.row.tags.map((tag: string) => {
            return (
              <Chip label={tag} />
            );
          })}
        </Stack>
      )
    },
    {
      field: 'statusName',
      headerName: 'Status',
      width: 250,
      editable: false,
    },
    {
      field: 'lastmodifieddatetime',
      headerName: 'Last Modified',
      width: 300,
      editable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={id => editProject(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={id => handleDeleteProject(params.id)}
        />,
      ],
    },
    ,
  ];

  /**
  * 'CustomToolbar' is a React functional component that renders a custom toolbar
  * for a data grid, containing a density selector.
  */
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarDensitySelector nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
        <GridToolbarExport />
      </GridToolbarContainer>

    );
  }

  /**
 * 'PageSize' set the number of rows 
 */
  const [pageSize, setPageSize] = useState(10);
  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  /**
   * FilterModel, which represents a set of filter conditions to be applied to some data. 
   * The object has a single property items, which is an array of objects, each representing an individual filter condition. 
   */
  const FilterModel = {
    items: [
      {
        id: 1,
        columnField: 'projectName',
        operatorValue: 'contains',
        value: projectName,
      },
      {
        id: 2,
        columnField: 'statusName',
        operatorValue: 'contains',
        value: projectStatusName,
      },
      {
        id: 3,
        columnField: 'tags',
        operatorValue: 'contains',
        value: selectedTags[0],
      },
      {
        id: 4,
        columnField: 'tags',
        operatorValue: 'contains',
        value: selectedTags[1],
        GridLinkOperator: "or",
      },
      {
        id: 5,
        columnField: 'tags',
        operatorValue: 'contains',
        value: selectedTags[2],
      },
      {
        id: 6,
        columnField: 'tags',
        operatorValue: 'contains',
        value: selectedTags[3],
        GridLinkOperator: "or"
      },
      {
        id: 7,
        columnField: 'tags',
        operatorValue: 'contains',
        value: selectedTags[4],
        GridLinkOperator: "or"
      }
    ],
  };



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
                onChange={handleNameChange}
                placeholder={t('Search by project name...')}
                value={projectName}
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
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Tags')}
                    placeholder={t('Select up to  5 tags...')}
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
                  // value={projectStatusName}
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
             {/* Placeholder for button */}
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <TableContainer>
          <Box p={1} sx={{ height: 600, width: '100%' }}>
            <DataGridPro

              getRowId={(row) => row.projectId}
              rows={rows}
              columns={columns}
              pageSize={pageSize}
              pagination
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={handlePageSizeChange}
              checkboxSelection
              filterModel={FilterModel}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </Box>
        </TableContainer>
      </Card>

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

export default Results;
