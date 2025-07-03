export interface AuthContextType {
  loggedUser: any | null;
  setLoggedUser: (user: any) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface HeaderProps {
  userKey: string;
  securityKey: string;
  sessionId?: string;
}

export interface ApiHeaderProps {
  session_id?: string;
  user_id?: number | string;
}

export interface ApiHeaderPropsDemo {
  session_id?: string;
  user_id?: number;
  distributorId?: number;
  countryId?: number;
  loggedUserDistributorId?: string[];
  status?: string;
}

export interface LoginCredentialsProps {
  email: string;
  password: string;
  captcha?: string | null; // Added captcha field
}

export interface ChangePasswordProps {
  email: string;
  password: string;
  id: number;
}

export interface AutoLoginCredentialsProps {
  userId: number;
  sessionId: string;
}

export interface LogoutCredentialsProps extends AutoLoginCredentialsProps {}

export interface fetchUserPrivProps {
  userKey: string;
  status?: string;
}

export interface UserDetailsProps {
  id: number;
  email: string;
  name: string;
  address: string;
  phone: string;
  ColorCode: string;
  unit: string;
  remarks: string;
  enteredBy: number | null;
  enteredDate: Date;
  joiningDate: Date | null;
  updatedBy: number;
  updatedDate: Date;
  status: string;
  apmeDashboardViewStatus: string;
  dashboardViewStatus: string;
  pswdResetReq: string;
  userType: string;
  userCategory: string;
  regionId: number;
  regionName: string;
  clusterId: number;
  clusterName: string;
  countryId: number;
  countryName: string;
  countryRegionId: number;
  countryRegionName: string;
  distributorId: number;
  distributorName: string;
  branchId: number;
  branchName: string;
  additionalRole: string;
  designation: string;
  defaultCountryId: number | null;
  defaultCountryName: string | null;
  imgPath: string | null;
  userRole: string | null;
  exitDate: string | null;
  mailSentStatus: number;
  recordStatus: string;
  closingStatus: string;
  loginDateTime: Date | null;
  loginLockedExpiryDateTime: Date | null;
  passwordErrorCount: number;
  sessionId: string;
  uom: string;
  privileges: number[];
  dataTill: any;
}

export interface UserPrivDetailsProps {
  userKey: number;
  userType: string;
  privilege: number;
  status: number;
}

export interface LoginResponseProps {
  status: number;
  msg: string;
  data: UserDetailsProps[];
  passwordErrorCount?: number;
  loginLockedExpiryDateTime?: string;
}

export interface LogoutResponseProps extends LoginResponseProps {}

export interface UserUpdateProps {
  status: number;
  msg: string;
  data: number[];
}

export interface UserPrivResponseProps {
  status: number;
  msg: string;
  data: UserPrivDetailsProps[];
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface AuthReduxType {
  loggedUser: UserDetailsProps | null;
  isLoading: boolean;
  isError: string | null;
}
