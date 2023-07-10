import {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  styled,
  Grid,
  Box,
  Typography,
  Avatar,
  Button,
  useTheme,
  Card,
  Select,
  MenuItem,
  TableContainer,
  CircularProgress,
  CircularProgressProps
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { useDispatch, useSelector } from '@/store';
import { createContent } from '@/slices/content';
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/Delete';
import { getWorkspaces } from '@/slices/workspace';
import { getKnowledgebases } from '@/slices/knowledgebase';
import { resolve } from 'path';
import { useRouter } from 'next/router';

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);

const UploadBox = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    background: ${theme.colors.alpha.trueWhite[10]};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={150}/>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h1"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function ImportContentBody() {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [workspace, setWorkspace] = useState<any>('');
  const [knowledgebase, setKnowledgebase] = useState('');
  const [validateDrop, setValidateDrop] = useState<boolean>(true);
  const [validateMessage, setValidateMessage] = useState<string>('');
  const [data, setData] = useState([]);
  const [fileCounter, setFileCounter] = useState(0);
  const [totalFileCount, setTotalFileCount] = useState(1);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  
  const router = useRouter();   

  const [progress, setProgress] = useState(1);


  useEffect(() => {
    dispatch(getWorkspaces());
    dispatch(getKnowledgebases());

    const eventSource = new EventSource('http://localhost:8080/api/contents/stream');

    eventSource.onmessage = (event: any) => {
      console.log('Received SSE event:', event.data);
     // const newData = JSON.parse(event.data);
      //setData(event.data);
      setData(JSON.parse(event.data));
      setFileCounter(JSON.parse(event.data).length)
    };

    eventSource.onerror = (event) => {
        console.error('Error in SSE connection:', event);
     //   eventSource.close();
    };
     
    return () => {
      console.log('UNMOUNTED');
      eventSource.close();
    }
  }, []);


  useEffect(() => {
    setProgress((prevProgress) => fileCounter*100/totalFileCount);
    console.log(fileCounter +'//////////////////////////////////////////'+ totalFileCount) 
    setIsUploadCompleted(() => (fileCounter == totalFileCount ?  true : false));
  //  setProgress((prevProgress) => (prevProgress >= 100 ?  100 : prevProgress + progressRate));

  }, [fileCounter]);

  const workspaces = useSelector((state) => state.workspace.workspaces);
  const knowledgebases = useSelector((state) => state.knowledgebase.knowledgebases);

  const checkValidateDrop = () => {
    if (validateDrop) {
      setValidateMessage('Workspace is required!');      
    }
  }

  const onDrop = (acceptedFiles) => {
    setProgress(1);
    setTotalFileCount(acceptedFiles.length);

    let formData = new FormData();
    formData.append('workspace', workspace );
    formData.append('knowledgebase', knowledgebase );
    
    return new Promise( (resolve, reject) => {
      acceptedFiles.forEach(function(file){ 
        const reader = new FileReader(); 
        console.log(file);
  
        //  reader.onabort = () => console.log('file reading was aborted')
       // reader.onerror = () => console.log('file reading has failed')
       ///   reader.onload = () => {
            formData.append('files', file);
            formData.append('lastModifiedDate', file.lastModifiedDate.toISOString());

          ///}
          
          reader.readAsDataURL(file);
          resolve(file);

        })
    }).then(() => {
      dispatch(createContent(formData, enqueueSnackbar));
    });

  };

  const {  
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps, 
    getInputProps} = useDropzone({
      accept: {
         "*": [".docx", ".pdf", ".txt", ".ppt"],
      },
      useFsAccessApi: false,
      onDrop: onDrop,
      disabled: validateDrop
  })
    
  const columns = [
      {
        field: 'id',
        headerName: 'id',
        width: 200,
        editable: false,
      },
      {
        field: 'title',
        headerName: 'Title',
        width: 200,
        editable: false,
      },{
        field: 'processingstatus',
        headerName: 'Processingstatus',
        width: 200,
        editable: false,
      }
    ];

    

    const [pageSize, setPageSize] = useState(10);
    const handlePageSizeChange = (params) => {
      setPageSize(params.pageSize);
    };

    const contentHome = () => {
      router.push('/techplaybook/content');
    };

  return (
    <>
    
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={0}>
          <Grid  
             item
             xs={8}
             sm={8}
             md={8}>
          <Grid container spacing={0}>
            <Grid
                  item
                  xs={8}
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
                    <b>{t('Workspace')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={8}
                  sm={6}
                  md={4}
                  >
                      
                      <Select
                        fullWidth
                        value={workspace} 
                        onChange={(e)=>{setWorkspace(e.target.value);setValidateDrop(false);setValidateMessage('');}}
                        label={t('Workspace')}
                      >
                              {workspaces.map((workspaceOption: any) =>{ 
                                return (
                                   <MenuItem key={workspaceOption.id} value={workspaceOption.id}>
                                   {workspaceOption.name}
                                  </MenuItem>
                              )} )}
                      </Select>
                      <Typography color='red'>{validateMessage}</Typography>
                </Grid>
        </Grid>
         <Grid container spacing={0} >
            <Grid
                  item
                  xs={8}
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
                    <b>{t('Knowledgebase')}:</b>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  item
                  xs={8}
                  sm={6}
                  md={4}
                  >
                      <Select
                       fullWidth
                        value={knowledgebase} 
                        onChange={(e)=> setKnowledgebase(e.target.value)}
                        label={t('Knowledgebase')}
                      >
                              {knowledgebases.map((knowledgebaseOption: any) =>{ 
                                return (
                                   <MenuItem key={knowledgebaseOption.id} value={knowledgebaseOption.id}>
                                   {knowledgebaseOption.name}
                                  </MenuItem>
                              )} )}
                      </Select>
                </Grid>
        </Grid>

          </Grid>
          <Grid 
              item
              xs={4}
              sm={4}
              md={4}>
               <CircularProgressWithLabel value={progress} />
               {isUploadCompleted && (
                <Button
                    variant="text"
                    size="large"
                    onClick={contentHome}
                  >{t('Return')}
                  </Button>
                )}
          </Grid>
        </Grid>
         

        <Grid container spacing={0} pl={20}>
            <Grid
                  item
                  xs={12}
                  sm={8}
                  md={8}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
        <UploadBox >
          <BoxUploadWrapper {...getRootProps()} >
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <AvatarSuccess variant="rounded" >
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drop the files to start uploading')}
                </Typography>
              </>
            )}
            {isDragReject && (
              <>
                <AvatarDanger variant="rounded">
                  <CloseTwoToneIcon />
                </AvatarDanger>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('You cannot upload these file types')}
                </Typography>
              </>
            )}
            {!isDragActive && (
              <>
                <AvatarWrapper variant="rounded">
                  <CloudUploadTwoToneIcon  onClick={checkValidateDrop}/>
                </AvatarWrapper>
                <Typography onClick={checkValidateDrop}
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drag & drop files to add your work space and knowledge base (Optional) ')}
                </Typography>
              </>
            )}
          </BoxUploadWrapper>

          {/*  
          {files.length > 0 && (
            <>
              <Alert
                sx={{
                  py: 0,
                  mt: 2
                }}
                severity="success"
              >
                {t('You have uploaded')} <b>{files.length}</b> {t('files')}!
              </Alert>
              <DividerContrast
                sx={{
                  mt: 2
                }}
              />
            </>
          )}
        */}
        </UploadBox>
        </Grid>
        <Grid>
        <Button {...getRootProps()}
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          onClick={checkValidateDrop}
        >{t('Browse folder')}
         <input {...getInputProps()} />
        </Button>

        <Button {...getRootProps()}
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('Browse files')}
         <input {...getInputProps()} />
        </Button>
        
        <Button
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('enter web page url')}
        </Button>
        
        <Button
          variant="text"
          size="large"
          sx={{
            mx: 5
          }}
          // onClick={closeConfirmDelete}
        >{t('enter web url')}
        </Button>
        
        </Grid>
        </Grid>
      </Card>   

       <Card>
          <Grid container spacing={0} pl={10}>
            <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  justifyContent="flex-end"
                  textAlign={{ sm: 'right' }}
                >
                  <TableContainer>
                    <Box p={1} sx={{ height: 600, width: '100%' }}>
                      <DataGridPro
                        getRowId={(row) => row.title}
                        rows={data}
                        columns={columns}
                        pageSize={pageSize}
                        pagination
                        rowsPerPageOptions={[5, 10, 20]}
                        onPageSizeChange={handlePageSizeChange}
                        checkboxSelection
                      />
                    </Box>
                  </TableContainer>
                
            </Grid>
          </Grid>   
       </Card>          
      
    </>
  );
}

export default ImportContentBody;
