import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { LoginCredentialsProps } from "../../props/Auth.props";
import { validateEmail, validatePassword } from "../../utils/Validation.utils";
import backgroundImage from "../../assets/images/backgrounds/iSteer-02.jpg";
import logo from "../../assets/images/logos/analytics_admin.png";
import open from "../../assets/images/basics/open-eye.png";
import close from "../../assets/images/basics/eye.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  loginFail,
  loginSuccess,
  setSessionExpired,
} from "../../contexts/slices/UserSlice";
import authService from "../../services/Auth.service";
import LoaderComponent from "../../components/sharedComponents/LoaderComponent";
import ReCAPTCHA from "react-google-recaptcha";
import { convertor } from "../../utils/Conversion.utils";
import { useCaptcheAuthentication } from "../../hooks/UseAuth";
import fetchYear from "@/services/Year.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "../../styles/ShadcnComponents.css";
// import "../../components/Components.css"

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [credentials, setCredentials] = useState<LoginCredentialsProps>({
    email: "",
    password: "",
    captcha: null,
  });

  const [errors, setErrors] = useState({
    email: null as string | null,
    password: null as string | null,
    captcha: null as string | null,
    loginError: null as string | null,
  });

  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { captchalogin } = useCaptcheAuthentication();
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    const decryptSiteKey = async () => {
      try {
        let encryptedKey = "";

        if (import.meta.env.VITE_ENVIRONMENT === "local") {
          encryptedKey = import.meta.env.VITE_CAPTCHA_KEY_LOCAL;
        } else {
          encryptedKey = import.meta.env.VITE_CAPTCHA_KEY_SERVER;
        }

        if (encryptedKey) {
          const decryptedKey = await convertor(
            "base64",
            "decrypt",
            encryptedKey
          );
          setSiteKey(decryptedKey);
        } else {
          toast.error("reCAPTCHA configuration is missing.");
        }
      } catch (error) {
        toast.error("Failed to load reCAPTCHA.");
      }
    };

    decryptSiteKey();
  }, []);

  useEffect(() => {
    const isFormValid =
      errors.email === "" &&
      errors.password === "" &&
      credentials.captcha !== null;
    setIsValid(isFormValid);
  }, [errors.email, errors.password, credentials.captcha]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    let validateField = name === "email" ? validateEmail : validatePassword;
    let validation = validateField(value);
    setErrors((prev) => ({
      ...prev,
      [name]: validation,
    }));

    if (name === "email") {
      const lockoutData = JSON.parse(
        localStorage.getItem("lockoutData") || "{}"
      );
      const emailToCheck = value;
      if (lockoutData[emailToCheck]) {
        const { lockExpiryTime, passwordErrorCount } =
          lockoutData[emailToCheck];
        const currentTime = new Date().getTime();
        const remainingAttempts = 5 - passwordErrorCount;

        if (remainingAttempts <= 0 && currentTime < lockExpiryTime) {
          setErrors((prev) => ({
            ...prev,
            loginError: "Your account is locked. Try again after 2 hours.",
          }));
        } else if (remainingAttempts <= 0) {
          // Clear expired lockout
          delete lockoutData[emailToCheck];
          localStorage.setItem("lockoutData", JSON.stringify(lockoutData));
          setErrors((prev) => ({ ...prev, loginError: null }));
        } else {
          setErrors((prev) => ({ ...prev, loginError: null }));
        }
      } else {
        setErrors((prev) => ({ ...prev, loginError: null }));
      }
    }
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      if (name === "email" || name === "password") {
        let validateField = name === "email" ? validateEmail : validatePassword;
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(credentials[name as "email" | "password"]),
        }));
      }
    },
    [credentials]
  );

  const handleCaptchaChange = useCallback((value: string | null) => {
    setCredentials((prev) => ({
      ...prev,
      captcha: value,
    }));
    setErrors((prev) => ({
      ...prev,
      captcha: null,
    }));
  }, []);

  const isLoginDisabled = () => {
    const lockoutData = JSON.parse(localStorage.getItem("lockoutData") || "{}");
    let isLocked = false;
    if (lockoutData[credentials.email]) {
      const { lockExpiryTime, passwordErrorCount } =
        lockoutData[credentials.email];
      const currentTime = new Date().getTime();
      if (passwordErrorCount >= 5 && currentTime < lockExpiryTime) {
        isLocked = true;
      } else if (passwordErrorCount >= 5) {
        // Clear expired lockout
        delete lockoutData[credentials.email];
        localStorage.setItem("lockoutData", JSON.stringify(lockoutData));
      }
    }
    const isDisabled =
      !credentials.email ||
      !credentials.password ||
      !credentials.captcha ||
      isLocked ||
      errors.email !== "" ||
      errors.password !== "";
    return isDisabled;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isLoginDisabled()) {
      return;
    }

    try {
      setIsLoading(true);
      const loginCredentials: Omit<LoginCredentialsProps, "captcha"> & {
        captcha: string;
      } = {
        ...credentials,
        captcha: credentials.captcha!,
      };
      const response = await captchalogin(loginCredentials);
      if (response.status === 1) {
        const userData = response.data[0];
        localStorage.removeItem("lockoutData");
        sessionStorage.setItem("loggedUser", JSON.stringify(userData));
        const apiCondition = {
          session_id: userData.sessionId,
          user_id: userData.id.toString(),
        };
        const privData = await authService.userPrivilegesApi(apiCondition, {
          userKey: userData.id.toString(),
          status: "A",
        });

        if (privData.status === 1) {
          const privileges = privData.data.map((priv: any) => priv.privilege);
          sessionStorage.setItem("userPriv", privileges.join(","));
          userData.privileges = privileges;

          const dataTill = await fetchYear(apiCondition, [
            String(userData.countryId),
          ]);
          userData.dataTill = dataTill;
          dispatch(loginSuccess(userData));

          const sessionExpirationTime = Date.now() + 60 * 60 * 1000;
          localStorage.setItem(
            "sessionExpirationTime",
            sessionExpirationTime.toString()
          );

          setTimeout(
            () => {
              dispatch(setSessionExpired());
            },
            60 * 60 * 1000
          );
        } else {
          toast.error("Error in fetching User Privileges...!");
        }
        setIsLoading(false);
        navigate("/");
      } else {
        setIsLoading(false);
        const remainingAttempts = 5 - (response.passwordErrorCount || 0);
        const lockoutData = JSON.parse(
          localStorage.getItem("lockoutData") || "{}"
        );
        if (remainingAttempts <= 0) {
          const lockExpiryTime = response.loginLockedExpiryDateTime
            ? new Date(response.loginLockedExpiryDateTime).getTime()
            : Date.now() + 2 * 60 * 60 * 1000;
          lockoutData[credentials.email] = {
            lockExpiryTime,
            passwordErrorCount: response.passwordErrorCount || 5,
          };
          localStorage.setItem("lockoutData", JSON.stringify(lockoutData));
          setErrors((prev) => ({
            ...prev,
            loginError:
              "Too many failed login attempts. Please login after 2 Hours. Contact Support Team.",
          }));
          toast.error(
            "Account locked. Please try again after 2 hours or contact support."
          );
        } else {
          const lockExpiryTime = response.loginLockedExpiryDateTime
            ? new Date(response.loginLockedExpiryDateTime).getTime()
            : Date.now() + 2 * 60 * 60 * 1000;
          lockoutData[credentials.email] = {
            lockExpiryTime,
            passwordErrorCount: response.passwordErrorCount || 0,
          };
          localStorage.setItem("lockoutData", JSON.stringify(lockoutData));
          setErrors((prev) => ({
            ...prev,
            loginError: `Invalid Login. ${remainingAttempts} attempts remaining.`,
          }));
          toast.error(response.msg);
        }
        dispatch(loginFail(response.msg));
        setCredentials((prev) => ({ ...prev, password: "", captcha: null }));
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Login failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      dispatch(loginFail(errorMessage));
      toast.error("Login failed. Please try again.");
      setCredentials((prev) => ({ ...prev, password: "", captcha: null }));
      recaptchaRef.current?.reset();
    }
  };

  const resetPassword = async () => {
    const data = await authService.forgotPassword(credentials.email);
    if (data.status === 1) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
    setCredentials((prev) => ({
      ...prev,
      email: "",
      captcha: null,
    }));
    setForgotPassword(!forgotPassword);
  };

  const hasEmailError =
    errors.email && errors.email !== "" && errors.email !== null;
  const hasPasswordError =
    errors.password && errors.password !== "" && errors.password !== null;

  return (
    <>
      {isLoading && <LoaderComponent />}
      <div
        className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-[#91c2bc] to-[#2fecff]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col justify-start items-center md:items-start md:w-1/2 px-36 md:px-10 mt-20 md:mt-10">
          <img src={logo} alt="iSteer INTEGRA" className="h-12" />
          <h1 className="text-white text-4xl mt-4">DATA INTEGRATION</h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="login-card">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!forgotPassword ? (
                  <div className="flex flex-col justify-between">
                    {errors.loginError && (
                      <p className="text-red-500 text-sm text-center">
                        {errors.loginError}
                      </p>
                    )}

                    <div className="relative z-0 mt-4">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        onBlur={handleBlur || undefined}
                        className={`peer floating-input ${hasEmailError ? "floating-input--error" : "floating-input--default"}`}
                        placeholder=" "
                        autoComplete="off"
                      />

                      <Label
                        htmlFor="email"
                        className={`floating-label ${hasEmailError ? "floating-label--error" : "floating-label--default"}`}
                      >
                        Email <span className="required-indicator">*</span>
                      </Label>

                      {hasEmailError && (
                        <span className="text-red-500 text-sm">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="relative z-0">
                      <div className="relative mt-6 ">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={credentials.password}
                          onChange={handleChange}
                          className={`peer floating-input ${hasPasswordError ? "floating-input--error" : "floating-input--default"}`}
                          placeholder=" "
                          autoComplete="off"
                          onBlur={handleBlur || undefined}
                        />
                        <Label
                          htmlFor="password"
                          className={`floating-label ${hasPasswordError ? "floating-label--error" : "floating-label--default"}`}
                        >
                          Password <span className="text-red-600">*</span>
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="show-password-button"
                          onClick={() => setShowPassword?.(!showPassword)}
                        >
                          {showPassword ? (
                            <img
                              src={open}
                              alt="Hide password"
                              className="w-6"
                            />
                          ) : (
                            <img
                              src={close}
                              alt="Show password"
                              className="w-6"
                            />
                          )}
                        </Button>
                      </div>
                      {hasPasswordError && (
                        <p className="text-sm text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="w-full flex justify-center mt-5">
                      {siteKey ? (
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={siteKey}
                          onChange={handleCaptchaChange}
                          size="normal"
                        />
                      ) : (
                        <div className="text-center">Loading reCAPTCHA...</div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoginDisabled()}
                      className="mt-5 mb-3 w-full"
                    >
                      LOG IN
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between items-center w-80"> 
                    <div className="my-6 text-gray">Forgot your password?</div>

                    <div className="my-4 w-full">
                      <div className="mt-4 mb-0 text-gray">
                        Please enter your email below
                      </div>

                      <div className="relative z-0 mt-4">
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={credentials.email}
                          onChange={handleChange}
                          onBlur={handleBlur || undefined}
                          className={`peer floating-input ${hasEmailError ? "floating-input--error" : "floating-input--default"}`}
                          placeholder=" "
                          autoComplete="off"
                        />

                        <Label
                          htmlFor="email"
                          className={`floating-label ${hasEmailError ? "floating-label--error" : "floating-label--default"}`}
                        >
                          Email <span className="text-red-600">*</span>
                        </Label>

                        {hasEmailError && (
                          <span className="text-red-500 text-sm">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      onClick={resetPassword}
                      disabled={!(errors.email === "")}
                      className="my-2 w-full"
                    >
                      RESET
                    </Button>

                    <Button
                      type="submit"
                      onClick={() => setForgotPassword(!forgotPassword)}
                      className="w-full bg-gray-500 hover:bg-gray-600"
                    >
                      Remembered it? Login in here
                    </Button>
                  </div>
                )}
              </form>

              {!forgotPassword && (
                <div className="text-center my-3">
                  <Button
                    type="button"
                    onClick={() => setForgotPassword(!forgotPassword)}
                    variant="link"
                    className="font-medium"
                  >
                    IF YOU FORGOT PASSWORD, CLICK HERE
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
