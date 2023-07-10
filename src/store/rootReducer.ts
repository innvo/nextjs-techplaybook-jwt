import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as projectsBoardReducer } from 'src/slices/projects_board';
import { reducer as mailboxReducer } from 'src/slices/mailbox';
import { reducer as userReducer } from 'src/slices/user';
import { reducer as projectReducer } from 'src/slices/projects';
import { reducer as tagReducer } from 'src/slices/tag';
import { reducer as projectstatusReducer } from 'src/slices/projectstatus';
import { reducer as projectbillingtypeReducer } from 'src/slices/projectbillingtype';
import { reducer as userProfilesReducer } from 'src/slices/userProfile';
import { reducer as contentReducer } from 'src/slices/content';
import { reducer as workspacerelcontentReducer } from 'src/slices/workspacerelcontent';
import { reducer as workspaceReducer } from 'src/slices/workspace';
import { reducer as knowledgebaseReducer } from 'src/slices/knowledgebase';

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  projectsBoard: projectsBoardReducer,
  mailbox: mailboxReducer,
  user: userReducer,
  project: projectReducer,
  tag: tagReducer,
  projectstatus: projectstatusReducer,
  projectbillingtype: projectbillingtypeReducer,
  userProfiles: userProfilesReducer,
  content: contentReducer,
  workspace: workspaceReducer, 
  knowledgebase: knowledgebaseReducer,
  workspacerelcontent: workspacerelcontentReducer
});
