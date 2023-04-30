import {Projectstatus} from  './projectstatus';

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

export interface Member {
  id: string;
  avatar: string | null;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  nameshort: string;
  description: string;
  projectstartdatetime: any;
  status: string;
  createdby: string;
  createdatetime: number;
  lastmodifiedby: string;
  lastmodifiedatetime: number;
  domain: number;
  projectstatus?: any;
  submit: any;
}

