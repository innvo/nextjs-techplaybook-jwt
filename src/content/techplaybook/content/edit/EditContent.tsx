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
} from '@mui/material';
import { Content } from '@/models/content';
import { Editor } from '@tinymce/tinymce-react';
import { makeStyles } from '@mui/styles';

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


interface ResultsProps {
  content: Content
}

// Functional Component
const EditContent: FC<ResultsProps> = ({ content }) => {

  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const editorRef = useRef(null);
  const tinyMCE_key = (process.env.REACT_APP_TINYMCE_KEY as string);

  const [contentHtml, setContentHtml] = useState(content.content_html);
  const [editorValue, seteditorValue] = useState<number>(0);
  const [sidebarValue, setsidebarValue] = useState<number>(0);

  
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

  return (
    <Grid
      sx={{ px: 4 }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >

      <Grid item xs={8}>
        <Card
          sx={{
            p: 1,
            mb: 3
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
                initialValue={content.content_html}
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
                 Text
               </Box>}

               {editorValue === 2 && <Box>
                 Markdown
               </Box>}
                                 
          
        </Card>  
      </Grid>
      <Grid item xs={4}>
        <Card
            sx={{
              p: 1,
              mb: 3
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
                <Grid container spacing={1} sx={{ pt: 4 }}>
                    <Grid item xs={9}>
                    {content.title}
                       <TextField
                          className={classes.myTextField}
                          variant='outlined'
                          label={t('Name ')}
                          name={content.title}
                          defaultValue={content.title}
                          onChange={e => { content.title = e.target.value; }}
                        />
                    </Grid>
                </Grid>    

               </Box>}

               {sidebarValue === 1 && <Box>
                 
               </Box>}

               {sidebarValue === 2 && <Box>
                 
               </Box>}

               {sidebarValue === 3 && <Box>
                 
               </Box>}
                          
        </Card> 
      </Grid>
    </Grid>
  );
}

export default EditContent;
