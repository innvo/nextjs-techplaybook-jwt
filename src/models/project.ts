import { GridRowId } from '@mui/x-data-grid';
import {Projectstatus} from  './projectstatus';

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

export interface Member {
  id: string;
  avatar: string | null;
  name: string;
}

export interface Project {
  tags: any;
  projectId: GridRowId;
  id: number;
  name: string;
  nameshort: string;
  description: string;
  projectstartdatetime: any;
  projectenddatetime: any;
  status: string;
  createdby: string;
  createdatetime: number;
  lastmodifiedby: string;
  lastmodifiedatetime: number;
  domain: number;
  projectstatus?: any;
}

