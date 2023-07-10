import { Content } from "./content";
import { Workspace } from "./workspace";

export interface Workspacerelcontent {
  id?: number;
  comment: string;
  status: string;
  createdby: string;
  createddatetime:  Date;
  lastmodifiedby: string;
  lastmodifieddatetime:  Date;
  workspacerelcontent_content?: Content,
  workspacerelcontent_workspace?: Workspace
  domain?: number;
}

