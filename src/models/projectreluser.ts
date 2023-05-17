import { Project } from "./project";
import { UserProfile } from "./userProfile";

export interface projectreluser {
  id?: number;
  role: string;
  comment: string;
  status: string;
  createdby: string;
  createddatetime: number;
  lastmodifiedby: string;
  lastmodifieddatetime: number;
  userprofile: UserProfile;
  project?: Project;
}

