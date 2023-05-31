import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import {
  Button,
  styled,
  Autocomplete,
  TextField,
  Grid,
  Card,
  useTheme,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TableContainer,
  Stack,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Checkbox
} from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useTranslation } from 'next-i18next';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '@/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import { Project } from '@/models/project';
import { useDispatch, useSelector } from '@/store';
import slice, {  addProjectrelusers } from '@/slices/projects';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { deleteProjectUserProfiles, getProjectUserProfiles, getUserProfiles } from '@/slices/userProfile';
import { GridDeleteIcon } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import { getProjectstatuss } from '@/slices/projectstatus';
import { projectreluser } from '@/models/projectreluser';
import { createTag, getTags, getTagsByProject } from '@/slices/tag';
import { Tag } from '@/models/tag';


// Rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


// CSS

const EditorWrapper = styled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);


// Data

// functional component

interface ResultsProps {
  project: Project;
}

 // function BasicTabs() {
const TabProfilePanel: React.FC<ResultsProps> = ({ project }) => {

  
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { user }  = useAuth();
  const dispatch= useDispatch();  
  const { enqueueSnackbar } = useSnackbar();
  const projectTags = useSelector((state) => state.tag.tags);
  const statusOptions = useSelector((state) => state.projectstatus.projectstatuss);
  const userProfiles = useSelector((state) => state.userProfiles.userProfiles);
  const userProjectProfiles = useSelector((state) => state.userProfiles.userProjectProfiles);
  const currentprojectTags = useSelector((state) => state.tag.ProjectTags);

  const [addTeamMemberDialog, setAddTeamMemberDialog] = useState(false);
  const [projectName, setProjectName] = useState(project?.name);
  const [nameShort, setNameShort] = useState(project?.nameshort);
  const [projectDescription, setProjectDescription] = useState(project?.description);
  const [projectStatus, setProjectStatus] = useState(null);
  const [projectstartdatetime, setProjectstartdatetime] = useState(project?.projectstartdatetime);
  const [projectenddatetime, setProjectenddatetime] = useState(project?.projectenddatetime);
  let [selectedTags, setSelectedTags] = useState<Tag[]>(currentprojectTags);

  const [teamMemeber, setTeamMemeber] = useState();
  const [memberRole, setMemberRole] = useState();

  let newTagInput = React.useRef<any>();


  const roles = [
    'Project Manager',
    'Developer',
    'Business Analyst',
    'Data Scientist',
    'Data Engineer'
  ];

  let currentProject: any;

  useEffect(() => {
    dispatch(getUserProfiles());
    dispatch(getProjectstatuss());
    dispatch(getProjectUserProfiles(project.id));
    dispatch(getTags());
    dispatch(getTagsByProject(project.id));

    setRows(userProjectProfiles);
    setProjectName(project?.name)
    setNameShort(project?.nameshort)
    setProjectDescription(project?.description)
    setProjectStatus(project?.projectstatus)
    setProjectstartdatetime(project?.projectstartdatetime)
    setProjectenddatetime(project?.projectenddatetime)    
  }, [project?.name, project.projectstatus]);


  useEffect(() => {
    setSelectedTags(currentprojectTags)
  }, [currentprojectTags]);


  const handleBlur= () => {
    console.log(selectedTags)
    currentProject={
      tags: selectedTags,
      projectId: project.id,
      id: project.id,
      name: projectName,
      nameshort: nameShort,
      description: projectDescription,
      projectstartdatetime: projectstartdatetime,
      projectenddatetime: projectenddatetime,
      status: 'ACTIVE',
      createdby: user.login, 
      createddatetime: Date.now(),
      lastmodifiedby: user.login,
      lastmodifieddatetime: Date.now(),
      projectstatus: projectStatus,
    }
    dispatch(slice.actions.getProject(currentProject));
  }  

  const handleAddSelectedTags = (tags) => {

    console.log(tags);

    selectedTags =[...tags]
    setSelectedTags(selectedTags)
      handleBlur();   
  }

  const addNewTag = (tagName) => {
    let newTag = {
      name: tagName,
      status: 'ACTIVE',
      createdby: user.login,
      createddatetime: Date.now(),
      lastmodifiedby: user.login,
      lastmodifieddatetime: Date.now()
    }

    console.log(tagName);
    dispatch(createTag(newTag, enqueueSnackbar));
  }


  const AddProjectTeamMember= () => {
    const projectrelusers: projectreluser = {
      role: memberRole,
      comment: 'No comment',
      status: 'ACTIVE',
      createdby: user.login,
      createddatetime:  Date.now(),
      lastmodifiedby: user.login,
      lastmodifieddatetime:  Date.now(),
      userprofile: teamMemeber,
      project: project
    }

    dispatch(addProjectrelusers(projectrelusers, enqueueSnackbar));
    setAddTeamMemberDialog(false);
    setTeamMemeber(null);
    setMemberRole(null);
  };

  const handleProjectStatusChange = (value) => {
   setProjectStatus(value)
   //project.projectstatus.id=value;
  };
  //team grid section

  const [rows, setRows] = useState(userProjectProfiles);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

   /**
 * `columns` is an array of column definitions to be used in a data grid.
 * It contains definitions for the ID and project name columns.
 */
   const columns = [
    {
      field: 'id',
      headerName: 'Id',
      hide: true
    },
    {
      field: 'login',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 200,
      editable: false,
    },
    {
      field: 'activated',
      headerName: 'Activated',
      //type: 'boolean',
      width: 200,
      editable: false,
      renderCell: (params) =>(
        <Checkbox
          checked={params.row?.activated}
       //   onChange={() => handleConfirmChange(params.row.rowId)}
        />
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: false,
    },
    {
      field: 'lastmodifieddatetime',
      headerName: 'Last Modified',
      width: 220,
      editable: false,
      valueFormatter: params => 
      moment(params?.value).format("YYYY-MM-DD hh:mm A Z"),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 80,
      renderCell: (params) => {
        const onClick = (e) => {
        //  const currentRow = params.row;
          dispatch(deleteProjectUserProfiles(project.id,params.row?.id)); 
        //  return alert(JSON.stringify(currentRow, null, 4));
        };
        return (
          <Stack direction="row" spacing={2}>
            <Button  onClick={onClick}> <GridDeleteIcon /></Button>
          </Stack>
        );
    },
    },
    ,
  ];
  
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
      <Grid item lg={7} xs={12}>
        <Card>
              <Grid container spacing={0} p={3}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Project Name')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <TextField
                 // error={Boolean(touched.name && errors.name)}
                    fullWidth
                 // helperText={touched.name && errors.name}
                    name='projectName'
                    placeholder={t('Project name here...')}
                    onBlur={handleBlur}
                    onChange={(value)=> {setProjectName(value.target.value)}}
                    value={projectName}
                    defaultValue={projectName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} justifyContent="flex-end" textAlign={{ sm: 'right' }}>
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Name Short')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <TextField
                  //  error={Boolean(touched.name && errors.name)}
                    fullWidth
                 //   helperText={touched.name && errors.name}
                    name="nameshort"
                    placeholder={t('Project short name here...')}
                    onBlur={handleBlur}
                    onChange={(value)=> {setNameShort(value.target.value)}}
                    value={nameShort}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box
                    pr={3}
                    sx={{
                      pb: { xs: 1, md: 0 }
                    }}
                  >
                    <b>{t('Description')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <EditorWrapper >
                    <ReactQuill 
                       onChange={setProjectDescription}
                       value={projectDescription} 
                       onChangeSelection={handleBlur} />
                  </EditorWrapper>
                </Grid>
               
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Project Tags')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Autocomplete
                    multiple
                    id='tags'
                    sx={{
                      m: 0
                    }}
                    limitTags={2}
                    value={selectedTags}
                    defaultValue={selectedTags}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, value, situation, option) => {
                      handleAddSelectedTags(value);
                    }}
                    noOptionsText={
                      <Button onClick={() => {
                        addNewTag(newTagInput?.current?.value);
                      }}>
                        Create New Tag
                          </Button>
                    }
                    options={projectTags}
                    getOptionLabel={(option: Tag) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={t('Tags')}
                        placeholder={t('Select up to  5 tags...')}
                        inputRef={newTagInput}
                        name='tags'
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Billing Type')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                  >
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>{t('Status')}</InputLabel>
                      <Select
                        // value={projectStatusName}
                       // onChange={handleStatusChange}
                        label={t('Status')}
                        
                      >
                        <MenuItem key='' value=''>
                            All
                          </MenuItem>
                      </Select>
                    </FormControl>
                </Grid>
              </Grid>
        </Card>
      </Grid>
      <Grid item lg={5} xs={12}>
        <Card>
        <Grid container spacing={0} p={3}>
               <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Project Status')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >          
                    <FormControl fullWidth variant="outlined">                    </FormControl>

                      <InputLabel>{t('')}</InputLabel>
                      <Select
                        value={JSON.stringify(projectStatus)} 
                        defaultValue={JSON.stringify(projectStatus)}
                        onChange={(e)=> {setProjectStatus(JSON.parse(e.target.value));handleBlur()}}
                        label={t('')}
                        
                      >
                          <MenuItem key='' value=''>
                            All
                          </MenuItem>
                          {statusOptions.map((statusOption: any) =>{ 
                          //  console.log('pppppppppppppppppppppppppppp;');
                           // console.log(statusOption);
                           // console.log(projectStatus)

                            return (
                            <MenuItem key={statusOption.id} value={JSON.stringify(statusOption)}>
                              {statusOption.name}
                            </MenuItem>
                          )} )}
                      </Select>
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Start Date')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <DatePicker
                    value={projectstartdatetime}
                    onChange={(newValue) =>  {console.log(newValue); setProjectstartdatetime(newValue);handleBlur()}}
                    renderInput={(params) => (
                      <TextField
                        placeholder={t('Select project start date...')}
                        {...params}
                      />
                    )}
                    
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('End Date')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <DatePicker
                    value={project.projectenddatetime}
                    onChange={(date) =>{}
                 //   handleChange({
                  //    target: { name: 'projectstartdatetime', value: date },
                   // })
                  }
                    // onChange={(newValue) => setStartdate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        placeholder={t('Select project start date...')}
                        {...params}
                      />
                    )}
                  />
                </Grid>
           </Grid>    
        </Card>
      </Grid>
       <Grid item md={12} xs={12}>
        <Card>
           <Box 
             sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }} >
            <Button 
              onClick={()=> setAddTeamMemberDialog(true)}
              variant="contained" 
              sx={{
                mr: 1
              }}
              endIcon={<SaveIcon />}>
                {t('Add Team Member')}
            </Button>
            </Box>  
          <TableContainer>
            <Box p={1} sx={{ height: 600, width: '100%' }}>
              <DataGridPro
                getRowId={(row: any) => row.role}
                rows={userProjectProfiles}
                columns={columns}
                pageSize={pageSize}
                pagination
                rowsPerPageOptions={[5, 10, 20]}
                onPageSizeChange={handlePageSizeChange}
               // checkboxSelection
             // filterModel={FilterModel}
                disableColumnFilter
                key='asd'
                

              />
            </Box>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>

    <Dialog
      fullWidth
      maxWidth="md"
      open={addTeamMemberDialog}
      onClose={setAddTeamMemberDialog}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Add Team Member')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Use this dialog window to add a new team memeber to a project')}
        </Typography>
      </DialogTitle>
          <DialogContent
              dividers
              sx={{
                p: 3
              }}
            >
              <Grid container spacing={0}>
                


              <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Team Memeber')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                  >
                    <Autocomplete
                      sx={{
                        m: 0
                      }}
                      limitTags={2}
                      // @ts-ignore
                    //  value={selectedTags}
                      onChange={(e, value: any) => {
                        setTeamMemeber(value); 
                      }}
                      options={userProfiles}
                      getOptionLabel={(option: any) => option?.firstname  + ' ' + option?.lastname}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          label={t('Select User')}
                          //placeholder={t('Select up to  5 tags...')}
                        />
                      )}
                    />
                </Grid>


                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <Box
                    pr={3}
                    sx={{
                      pt: `${theme.spacing(2)}`,
                      pb: { xs: 1, md: 0 }
                    }}
                    alignSelf="center"
                  >
                    <b>{t('Roles')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Autocomplete
                    sx={{
                      m: 0
                    }}
                    limitTags={2}
                    // @ts-ignore
                  //  value={selectedTags}
                    onChange={(e, value: any) => {
                      setMemberRole(value);
                    }}
                    options={roles}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={t('Select Roles')}
                     //   placeholder={t('Select up to  5 tags...')}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  textAlign={{ sm: 'right' }}
                />
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Button
                    sx={{
                      mr: 2
                    }}
                    type="submit"                    
                    variant="contained"
                    size="large"
                    onClick={()=> AddProjectTeamMember()}
                  >
                    {t('Add Team Memeber')}
                  </Button>
                  <Button
                    color="secondary"
                    size="large"
                    variant="outlined"
                    onClick={()=> setAddTeamMemberDialog(false)}
                  >
                    {t('Cancel')}
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
    </Dialog>
  
  </>
  )
}
export default TabProfilePanel;

