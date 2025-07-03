import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  AuthContextType,
  AutoLoginCredentialsProps,
  LoginResponseProps,
  UserDetailsProps,
} from "../props/Auth.props";
import { useNavigate } from "react-router-dom";
import authService from "../services/Auth.service";
import toast from "react-hot-toast";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedUser, setLoggedUser] = useState<UserDetailsProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  const logout = () => {
    sessionStorage.removeItem("loggedUser");
    setLoggedUser(null);
    navigate("/login");
  };
  const storedUser = sessionStorage.getItem("loggedUser");

  const checkAutoLogin = async () => {
    try {
      setIsLoading(true);
      if (!storedUser) {
        setIsLoading(false);
        navigateToLogin();
        return;
      }

      const localUserData = storedUser && JSON.parse(storedUser);

      let inputData: AutoLoginCredentialsProps = {
        userId: Number(localUserData.id),
        sessionId: localUserData.sessionId,
      };

      const response: LoginResponseProps =
        await authService.autoLogin(inputData);
      if (response.status == 1) {
        setLoggedUser(response.data[0]);
        navigate("/");
      } else {
        toast.error(response.msg || "Session expired...!");
        logout();
      }
    } catch (error) {
      console.error("Auto login error:", error);
      toast.error("Session validation failed");
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    setIsLoading(false);
    navigate("/login");
    return;
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (loggedUser) {
        return;
      }

      if (!loggedUser && storedUser) {
        checkAutoLogin();
        return;
      }

      if (!loggedUser && !storedUser) {
        navigateToLogin();
        return;
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedUser, setLoggedUser, logout, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
