import { useState, useEffect, FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tabs,
  Tab,
  Grid,
  Box,
  Card,
  createTheme,
  TextField,
  Select,
  Typography,
  useTheme,
  MenuItem,
  InputLabel,
  FormControl,
  GridSize,
  Checkbox,
} from '@mui/material';
import { Content } from '@/models/content';
import { Editor } from '@tinymce/tinymce-react';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from '@/store';
import { getWorkspaces } from '@/slices/workspace';
import { getKnowledgebases } from '@/slices/knowledgebase';
import { default as contentslice } from '@/slices/content';
import { updateContent } from '@/slices/content';

import { default as workspacerelcontentslice } from '@/slices/workspacerelcontent';

import { useAuth } from '@/hooks/useAuth';
import { Workspace } from '@/models/workspace';
import { WorkspacesOutlined } from '@mui/icons-material';
import { Workspacerelcontent } from '@/models/workspacerelcontent';
import moment from 'moment';

const defaultTheme = createTheme();

const useStyles = makeStyles(
  (theme) => {
    return {
      muiTabsFull: {
        marginLeft: 0,
        marginRight: 0,
        borderBottom: `5px solid ${theme.palette.grey[300]}`,
        '& .MuiTabs-flexContainer': {
          '& .MuiTab-root': {
            flex: 1,
          },
        },
      },
      btnRoot: {
        width: '100%',
        fontSize: 8,
        textTransform: 'capitalize',
      },
      myTextField: {
        width: '100%',
        marginBottom: 8,
        [theme.breakpoints.up('xl')]: {
          marginBottom: 8,
        },
      },
      muiTab: {
        fontSize: 12,
        paddingBottom: 8,
        paddingTop: 8,
        marginLeft: 2,
        marginRight: 1,
        color: theme.palette.text.secondary,
      },
      widthFull: {
        width: '100%',
      },
      pointer: {
        cursor: 'pointer',
      },
      errorText: {
        "&&": {
          color: "red"
        }
      }
    };
  },
  { defaultTheme }
);

// Functional Component
const NewContent = () => {

  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const editorRef = useRef(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user }  = useAuth();

  const tinyMCE_key = (process.env.REACT_APP_TINYMCE_KEY as string);

  const [sidebarStatus, setSidebarStatus] = useState<boolean>(true);
  const [lgEditorSize, setLgEditorSize] = useState<GridSize>(7);
  const [lgTabSize, setLgTabSize] = useState<GridSize>(5);

  const [contentTitle, setContentTitle] = useState('');
  const [workspace, setWorkspace] = useState(null);

  const [contentHtml, setContentHtml] = useState('');
  const [contentTxt, setContentTxt] = useState('');
  const [editorValue, seteditorValue] = useState<number>(0);
  const [sidebarValue, setsidebarValue] = useState<number>(0);

  const [knowledgebase, setKnowledgebase] = useState('');
  const [validateMessage, setValidateMessage] = useState<string>('');

  useEffect(() => {
    dispatch(getWorkspaces());
    dispatch(getKnowledgebases());
    //setContentTitle(content.title)
  }, []);
  
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const knowledgebases = useSelector((state) => state.knowledgebase.knowledgebases);

  const handleEditorChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    seteditorValue(newValue);
  };

  const handleSidebarChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setsidebarValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const createContent = () => {
    console.log('fffffffffffffffffffffffffffffffffff')
    console.log(workspace)
    console.log(knowledgebase)
    let currentContent = {
     // id: content.id,
      title: contentTitle,
      istemplate: false,
      isfeatured: false,
      content_html: contentHtml,
      content_txt: contentTxt,
      content_summary: '',
      description: '',
      url: '',
      authors: '',
      datepublished: Date.now(),
      poststartdatetime: Date.now(),
      postenddatetime: Date.now(),
      status: '',
      createdby: user.login,
      createddatetime: Date.now(),
      lastmodifiedby: user.login,
      lastmodifieddatetime: Date.now(),
      workspaceId: workspace,
      knowledgebaseId: knowledgebase
    }
    dispatch(contentslice.actions.getContent(currentContent));
  }    

  const showHideSidebar = (sidebarStatus: boolean) => {
    if (sidebarStatus === true) {
      setSidebarStatus(false);
      setLgEditorSize(12);
      setLgTabSize(1);
    }
    if (sidebarStatus === false) {
      setSidebarStatus(true);
      setLgEditorSize(7);
      setLgTabSize(5);
    }
  }

  return (
    <>
     <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
      >
        <Grid
          item
          lg={10}
          sm={10}
          xs={10}
        >   
        </Grid>
        <Grid
          item
          lg={2}
          sm={2}
          xs={2}
        >
          <span >Hide the sidebar</span>
            <Checkbox
              checked={sidebarStatus}
              onChange={() => showHideSidebar(sidebarStatus)}
              inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
    </Grid>
    <Grid
      sx={{ px: 4 }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >

      <Grid item xs={12} sm={9} lg={lgEditorSize}>
        <Card
          sx={{
            p: 1,
            mb: 3,
            height: '100%' 
          }}
        >
         <Tabs
            value={editorValue}
            onChange={handleEditorChange}
            indicatorColor='primary'
            textColor='primary'
            aria-label='simple tabs example'
            className={classes.muiTabsFull}>
              <Tab
                className={classes.muiTab}
                label='Html'
                  {...a11yProps(0)}
               />
               <Tab
                className={classes.muiTab}
                label='Text'
                  {...a11yProps(1)}
               />
               <Tab
                className={classes.muiTab}
                label='Markdown'
                  {...a11yProps(2)}
               />
          </Tabs>     
               {editorValue === 0 && <Box>
                 
                <Editor
                apiKey={tinyMCE_key}
                onInit={(evt: any, editor: any) => editorRef.current = editor}
                //initialValue={content.content_html}
                value={contentHtml}
                onEditorChange={(newContentValue, editor) => { setContentHtml(newContentValue); }}
                init={{
                  height: 700,
                  menubar: false,
                  branding: false,
                  plugins: [
                    "wordcount advlist lists spellchecker image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste"
                  ],
                  toolbar_mode: 'scrolling',
                  toolbar: "annotate edit unannotate | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                  content_style: '.mce-annotation { background-color: darkgreen; color: white; }',
                  setup: function (editor: any) {

                    editor.ui.registry.addButton('annotate', {
                      text: 'Annotate',
                      onAction: function () {
                        //dispatch({ type: CREATE_NEW_CONTENT, payload: contentItem });

                        editor.annotator.annotate('alpha', {
                          uid: Math.random().toString(16).slice(2),
                        });
                        setTimeout(() => {
                          //handleAddAnnotateOpen();
                        }, 500)
                      },
                      onSetup: function (btnApi: any) {
                        editor.annotator.annotationChanged('alpha', function (state: any, name: any, obj: any) {
                          if (obj) {
                            if (obj.nodes.length > 0) {
                           //   contentItem.contentHtml = obj.nodes[0].parentNode.innerHTML;
                           //   const annotationObj: AnnotationObj = {
                           //     id: 0,
                           //     editorAnnotationId: obj.uid,
                           //     content: contentItem,
                           //     annotationHtml: obj.nodes[0].innerHTML,
                           //     annotationCommentHtml: 'oldAnnotations[0].annotationCommentHtml',
                           //     tags: [],
                           //     tagsString: '',
                           //     area: '',
                           //     subArea: '',
                           //     projectSphere: '',
                           //     projectForce: '',
                           //     dataType: '',
                           //     dateOfRelevance: new Date(),
                           //     bestUsedBy: new Date(),
                           //     geographicDetails: '',
                           //     domain: 'SMARTINN',
                           //     status: 'ACTIVE',
                           //     createdBy: "ADMIN",
                           //     createdDate: new Date(),
                           //     lastModifiedBy: ''
                           //   };

                         //     setEditorAnnotationId(obj.uid)
                         //     dispatch(onGetAnnotationByEditorAnnotationId(obj.uid, annotationObj, dispatch));
                         //     dispatch({ type: CREATE_NEW_ANNOTATION, payload: annotationObj });
                         //     isButtonsActions = !state
                              btnApi.setDisabled(state);
                            }
                          }
                          btnApi.setDisabled(state);

                        });
                      }
                    });
                    editor.on('init', function () {
                      editor.annotator.register('alpha', {
                        persistent: true,
                        decorate: function (uid: any, data: any) {
                          return {
                            attributes: {
                            }
                          };
                        }
                      });
                    });

                    editor.ui.registry.addButton('edit', {
                      text: 'Edit',
                      onAction: function () {
                        //dispatch({ type: CREATE_NEW_CONTENT, payload: contentItem });
                        setTimeout(() => {
                          //handleAddAnnotateOpen();
                        }, 300)
                      },
                      onSetup: function (btnApi: any) {
                        var editorEventCallback = function (eventApi: any) {
                         // btnApi.setDisabled(isButtonsActions);
                        };
                        editor.on('NodeChange', editorEventCallback);
                      }
                    });

                    editor.ui.registry.addButton('unannotate', {
                      text: 'Unannotate',
                      onAction: function () {
                        editor.annotator.remove('alpha');
                       // setDeleteDialogOpen(true);
                        editor.focus();
                      },
                      onSetup: function (btnApi: any) {
                        var editorEventCallback = function (eventApi: any) {
                       //   btnApi.setDisabled(isButtonsActions);
                        };
                        editor.on('NodeChange', editorEventCallback);
                        editor.focus();
                      }
                    });
                  }
                }}
              />
                
               </Box>}

               {editorValue === 1 && <Box>
               </Box>}

               {editorValue === 2 && <Box>
                 Markdown
               </Box>}
                                 
          
        </Card>  
      </Grid>

      {(sidebarStatus === true) &&
       <Grid item xs={12} sm={9} lg={lgTabSize}>
        <Card
            sx={{
              p: 1,
              mb: 3,
              height: '100%' 
            }}
          >
            
            <Tabs
            value={sidebarValue}
            onChange={handleSidebarChange}
            indicatorColor='primary'
            textColor='primary'
            aria-label='simple tabs example'
            className={classes.muiTabsFull}>
              <Tab
                className={classes.muiTab}
                label='Details'
                  {...a11yProps(0)}
               />
               <Tab
                className={classes.muiTab}
                label='Summary'
                  {...a11yProps(1)}
               />
               <Tab
                className={classes.muiTab}
                label='Annotation'
                  {...a11yProps(2)}
               />
               <Tab
                className={classes.muiTab}
                label='Metadata'
                  {...a11yProps(3)}
               />
          </Tabs>     
               {sidebarValue === 0 && <Box>
                <Grid container spacing={1} sx={{ pt: 3 }}>
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                        <b>{t('Title')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`
                      }}
                      item
                      xs={8}
                      sm={8}
                      md={8}
                      >
                          <TextField
                            className={classes.myTextField}
                            variant='outlined'
                            label={t('Title ')}
                            name={contentTitle}
                            value={contentTitle}
                            defaultValue={contentTitle}
                            onChange={e => setContentTitle(e.target.value)}
                            onBlur={createContent}
                        />
                          <Typography color='red'>{validateMessage}</Typography>
                    </Grid>
                    </Grid>

                    <Grid container spacing={1} >
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                      sm={8}
                      md={8}
                      >
                        <FormControl fullWidth>
                          <InputLabel id="workspace-label">Workspace</InputLabel>
                          <Select
                            fullWidth
                            value={workspace} 
                            onChange={(e)=>{setWorkspace(e.target.value);console.log(e.target.value);setValidateMessage('');createContent();}}
                            label={t('Workspace')}
                            onBlur={createContent}
                            id="workspace-label"
                          >
                                  {workspaces.map((workspaceOption: any) =>{ 
                                    return (
                                      <MenuItem key={workspaceOption.id} value={workspaceOption.id}>
                                      {workspaceOption.name}
                                      </MenuItem>
                                  )} )}
                          </Select>
                          </FormControl>
                          <Typography color='red'>{validateMessage}</Typography>
                    </Grid>
                    </Grid>

                    <Grid container spacing={0} >
                        <Grid
                              item
                              xs={3}
                              sm={3}
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
                              sm={8}
                              md={8}
                              >
                                <FormControl fullWidth>
                                  <InputLabel id="knowledgebase-label">Knowledgebase</InputLabel>
                                  <Select
                                    value={knowledgebase} 
                                    onChange={(e)=> {setKnowledgebase(e.target.value);createContent();}}
                                    label={t('Knowledgebase')}
                                    id="knowledgebase-label"
                                    onBlur={createContent}
                                  >
                                          {knowledgebases.map((knowledgebaseOption: any) =>{ 
                                            return (
                                              <MenuItem key={knowledgebaseOption.id} value={knowledgebaseOption.id}>
                                              {knowledgebaseOption.name}
                                              </MenuItem>
                                          )} )}
                                  </Select>
                                </FormControl>
                          </Grid>
                    </Grid>    

                  </Box>}

                  {sidebarValue === 1 && <Box>
                    
                  </Box>}

                  {sidebarValue === 2 && <Box>
                    
                  </Box>}

                  {sidebarValue === 3 && <Box>
                    <Grid container spacing={1} sx={{ pt: 3 }}>
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                        <b>{t('File Name')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`
                      }}
                      item
                      xs={8}
                      sm={8}
                      md={8}
                      >
                          <TextField
                            disabled
                            className={classes.myTextField}
                            variant='outlined'
                            label={t('File Name')}
                            name={contentTitle}
                            value={contentTitle}
                            defaultValue={contentTitle}
                            onChange={e => setContentTitle(e.target.value)}
                            onBlur={createContent}
                        />
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ pt: 3 }}>
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                        <b>{t('File Type')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`
                      }}
                      item
                      xs={8}
                      sm={8}
                      md={8}
                      >
                          <TextField
                            disabled
                            className={classes.myTextField}
                            variant='outlined'
                            label={t('File Type')}
                         //   name={content.fileContentType}
                          ///  value={content.fileContentType}
                          //  defaultValue={content.fileContentType}
                            onChange={e => setContentTitle(e.target.value)}
                          //  onBlur={editContent}
                        />
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ pt: 3 }}>
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                        <b>{t('File Size KB')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`
                      }}
                      item
                      xs={8}
                      sm={8}
                      md={8}
                      >
                          <TextField
                            disabled
                            className={classes.myTextField}
                            variant='outlined'
                            label={t('File Size')}
                            name={contentTitle}
                           // value={content.fileSize}
                            defaultValue={contentTitle}
                            onChange={e => setContentTitle(e.target.value)}
                           // onBlur={editContent}
                        />
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ pt: 3 }}>
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                        <b>{t('File Date Time')}:</b>
                      </Box>
                    </Grid>
                    <Grid
                      sx={{
                        mb: `${theme.spacing(3)}`
                      }}
                      item
                      xs={8}
                      sm={8}
                      md={8}
                      >
                          <TextField
                            disabled
                            className={classes.myTextField}
                            variant='outlined'
                            label={t('File Date Time')}
                           // value={moment(content.fileDateTime).format("YYYY-MM-DD hh:mm A Z")}
                            //defaultValue={content.fileDateTime}
                            onChange={e => setContentTitle(e.target.value)}
                            //onBlur={editContent}
                        />
                    </Grid>
                    </Grid>
                    
                  </Box>}
                              
            </Card> 
          </Grid>
           }
            {(sidebarStatus === false) && <div></div>}
        </Grid>
        </>
      );
    }

    export default NewContent;
