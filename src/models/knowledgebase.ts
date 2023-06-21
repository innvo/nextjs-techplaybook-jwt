export interface Knowledgebase {
  id: number;
  name: string;
  nameshort: string;
  description: string;
  status: string;
  createdby: string;
  createddatetime: number;
  lastmodifiedby: string;
  lastmodifieddatetime: number;
  domain?: number;
}

