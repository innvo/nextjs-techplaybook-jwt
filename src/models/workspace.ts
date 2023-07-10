export interface Workspace {
  id?: number;
  name: string;
  nameshort: string;
  description: string;
  status: string;
  createdby: string;
  createddatetime:  Date;
  lastmodifiedby: string;
  lastmodifieddatetime:  Date;
  domain?: number;
}

