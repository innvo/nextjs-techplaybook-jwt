export interface User {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  activated: boolean;
  langKey: string;
  jobtitle: string;
  avatar: string;
  password: string;
  authorities: any[];
  lastModifiedDate: string;
  // jobtitle: string;
  // username: string;
  // location: string;
  // role: string;
  // posts: string;
  // coverImg: string;
  // followers: string;
  // description: string;
  // [key: string]: any;
}
