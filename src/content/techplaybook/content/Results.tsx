
import * as React from 'react';
import {
  FC,
  useState,
  useEffect
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGridPro, GridActionsCellItem, GridRowId, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarColumnsButton, GridToolbarExport } from '@mui/x-data-grid-pro';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { TableContainer } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDispatch } from '@/store';
import { deleteContent } from '@/slices/content';
import moment from 'moment';
import Link from 'next/link';
import { Content } from '@/models/content';


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
 * for a React component that displays a list of contents.
 * @typedef {Object} ResultsProps
 * @property {content[]} contents - An array of contents, where each content is an object of type content.
 */;
interface ResultsProps {
  contents: Content[];
}

const Results: FC<ResultsProps> = ({ contents }) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [contentName, setContentName] = useState('');
  const [selectedContentId, setSelectedContentId] = useState(0);
  const [selectedContentName, setSelectedContentName] = useState('');
  const router = useRouter(); 
  
  useEffect(() => {
  }, []);


  /**
   * Edit Content
 */
  const editContent = (id: GridRowId) => {
     router.push('/techplaybook/content/edit/' + id);
  };

  /**
   * Delete Content
 */
  const handleDeleteContent = (id: number, name: string) => {
    setSelectedContentId(id);
    setSelectedContentName(name);
    setOpenConfirmDelete(true);
  };

  /**
   * Search Datagrid
   *    handleNameChang
   *  handleStatusChange
   *    newSelectedTags
   */

  const handleNameChange = (searchValue) => {
    setContentName(searchValue.target.value);
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
    dispatch(deleteContent(selectedContentId, enqueueSnackbar));
  };

  /**
 * `columns` is an array of column definitions to be used in a data grid.
 * It contains definitions for the ID and content name columns.
 */
  const columns = [
    { 
      field: 'id', 
      headerName: 'Id', 
      width: 90,
      renderCell: (params) => (
        <Link  key={params.value}  href={`/techplaybook/content/edit/${params.value}`}><a>{params.value}</a></Link>
      )
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      editable: false,
    },
    {
      field: '  Workspace',
      headerName: 'Workspace',
      width: 200,
      editable: false,
    },
    {
      field: 'Knowledgebase',
      headerName: 'Knowledgebase',
      width: 200,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'status',
      width: 200,
      editable: false,
    },
    {
      field: 'lastmodifieddatetime',
      headerName: 'Last Modified',
      width: 250,
      editable: false,
      valueFormatter: params => 
      moment(params?.value).format("YYYY-MM-DD hh:mm A Z"),
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
          onClick={id => editContent(params.row.contentId)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={id => handleDeleteContent(params.row.contentId, params.row.contentName)}
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
                placeholder={t('Search by content name...')}
                value={contentName}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <TableContainer>
          <Box p={1} sx={{ height: 600, width: '100%' }}>
            <DataGridPro
              rows={contents}
              columns={columns}
              pageSize={pageSize}
              pagination
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={handlePageSizeChange}
              checkboxSelection
              disableColumnFilter
              initialState={{
                sorting: {sortModel:[{field: 'lastmodifieddatetime', sort: 'desc'}]},
              }}
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
            {t('Do you really want to delete this content')} (  { selectedContentName } )  ?
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
