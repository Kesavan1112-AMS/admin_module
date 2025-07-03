"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  logOut,
  loginSuccess,
  setSessionExpired,
  clearSessionExpired,
} from "../../contexts/slices/UserSlice"
import type { RootState } from "../../stores/Auth"
import toast from "react-hot-toast"
import { useAuthentication } from "../../hooks/UseAuth"

const SessionExpiredModal: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const sessionExpired = useSelector((state: RootState) => state.loggedUserInfo.sessionExpired)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthentication()

  useEffect(() => {
    if (sessionExpired) {
      setIsVisible(true)
    }
  }, [sessionExpired])

  const handleNo = () => {
    dispatch(logOut())
    dispatch(clearSessionExpired()) // Clear the session expired state
    sessionStorage.clear()
    localStorage.clear()
    navigate("/login")
    setIsVisible(false)
  }

  const handleYes = async () => {
    try {
      setIsLoading(true)

      const loggedUserData = sessionStorage.getItem("loggedUser")

      if (!loggedUserData) {
        toast.error("No user session found")
        handleNo()
        return
      }

      const userData = JSON.parse(loggedUserData)
      console.log("Retrieved user data:", userData)

      const { email, password } = userData

      if (!email || !password) {
        toast.error("Invalid session data - missing email or password")
        handleNo()
        return
      }

      let decodedPassword: string
      try {
        decodedPassword = atob(password)
        console.log("Decoded password for API call")
      } catch (error) {
        console.error("Failed to decode password:", error)
        toast.error("Invalid password format in session")
        handleNo()
        return
      }

      console.log("Using credentials:", { email, password: "***" })

      const credentials = {
        email: email,
        password: decodedPassword,
      }

      const response = await login(credentials)

      if (response.status === 1) {
        const userData = response.data[0]

        sessionStorage.setItem("loggedUser", JSON.stringify(userData))

        dispatch(loginSuccess(userData))
        dispatch(clearSessionExpired()) // Clear the session expired state

        const sessionExpirationTime = Date.now() + 3600000
        localStorage.setItem("sessionExpirationTime", sessionExpirationTime.toString())

        setTimeout(() => {
          dispatch(setSessionExpired())
        }, 3600000)

        toast.success("Session refreshed successfully")
        setIsVisible(false)
      } else {
        toast.error(response.msg || "Session refresh failed")
        console.error("Session refresh failed:", response)
        handleNo()
      }
    } catch (error) {
      console.error("Session refresh error:", error)
      toast.error("Session refresh failed due to an error")
      handleNo()
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if not visible or if session is not expired
  if (!isVisible || !sessionExpired) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Session Expired</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Do you want to continue?</p>
          <div className="flex gap-3">
            <button
              onClick={handleNo}
              disabled={isLoading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
            >
              No
            </button>
            <button
              onClick={handleYes}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Yes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionExpiredModal

