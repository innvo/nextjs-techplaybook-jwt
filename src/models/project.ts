import { GridRowId } from '@mui/x-data-grid';
import {Projectstatus} from  './projectstatus';
import { Tag } from './tag';

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

export interface Member {
  id: string;
  avatar: string | null;
  name: string;
}

export interface Project {
  tags: any;
  deletedtags: Tag[];
  projectId: GridRowId;
  id: number;
  name: string;
  nameshort: string;
  description: string;
  projectstartdatetime: any;
  projectenddatetime: any;
  status: string;
  createdby: string;
  createddatetime: number;
  lastmodifiedby: string;
  lastmodifieddatetime: number;
  domain?: number;
  projectstatus?: any;
  projectbillingtype?: any;
}

