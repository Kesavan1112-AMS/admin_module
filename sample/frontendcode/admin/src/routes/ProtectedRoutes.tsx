import { Navigate, useLocation } from "react-router-dom";
import { jwtVerification } from "../utils/Validation.utils";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/Auth";
import { loggedUserUpdate, loginSuccess } from "../contexts/slices/UserSlice";
import { useEffect, useRef, useState } from "react";
import { UserDetailsProps } from "../props/Auth.props";

const checkUserPrivilege = (
  userData: UserDetailsProps | null,
  requiredPrivileges: number[]
) => {
  if (!userData || !userData.privileges) {
    return false;
  }

  return requiredPrivileges.every((privilege) =>
    userData.privileges.includes(privilege)
  );
};

export const ProtectRoutes = ({
  element,
  requiredPrivileges,
}: {
  element: JSX.Element;
  requiredPrivileges?: number[];
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const loggedUser = useSelector(
    (state: RootState) => state.loggedUserInfo.loggedUser
  );
  const [hasPrivilege, sethasPrivilege] = useState<boolean | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      const privCheck = (userData: UserDetailsProps) => {
        if (requiredPrivileges) {
          sethasPrivilege(checkUserPrivilege(userData, requiredPrivileges));
        } else {
          sethasPrivilege(true);
        }
      };

      let previousPath = sessionStorage.getItem("reqPath");
      if (
        previousPath &&
        sessionStorage.getItem("previousPath") != location.pathname
      ) {
        sessionStorage.setItem("previousPath", previousPath);
      }
      isFirstRender.current = false;

      const checkAuth = async () => {
        if (loggedUser) {
          const isValid = jwtVerification(loggedUser.sessionId);
          if (isValid) {
            privCheck(loggedUser);
            setIsAuthorized(true);
            return;
          }
        }

        const localData = sessionStorage.getItem("loggedUser");

        if (localData) {
          const loggedUserData = JSON.parse(localData);
          const isValid = jwtVerification(loggedUserData.sessionId);

          if (isValid) {
            dispatch(loginSuccess(loggedUserData));
            const userPriv = sessionStorage.getItem("userPriv");
            if (userPriv) {
              let privileges = userPriv.split(",").map(Number);
              dispatch(loggedUserUpdate({ privileges: privileges }));
              let userData = {
                ...loggedUserData,
                privileges: privileges,
              };
              privCheck(userData);
            }
            setIsAuthorized(true);
            return;
          } else {
            setTimeout(function () {
              toast.error("Session Expired...!");
            }, 1000);
          }
        }

        setIsAuthorized(false);
        return;
      };

      sessionStorage.setItem("reqPath", location.pathname);
      checkAuth();
    }
  }, [dispatch, loggedUser, location]);

  if (hasPrivilege == false) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (isAuthorized === null) {
    return null;
  }

  return isAuthorized ? element : <Navigate to="/login" replace />;
};
