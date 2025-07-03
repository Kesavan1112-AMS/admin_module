import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSessionExpired } from "../contexts/slices/UserSlice"
import type { RootState } from "../stores/Auth"

export const useSessionManager = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state: RootState) => state.loggedUserInfo.loggedUser)

  useEffect(() => {
    if (!loggedUser) {
      localStorage.removeItem("sessionExpirationTime")
      return
    }

    const checkSessionExpiration = () => {
      const sessionExpirationTime = localStorage.getItem("sessionExpirationTime")

      if (sessionExpirationTime) {
        const expirationTime = Number.parseInt(sessionExpirationTime, 10)
        const currentTime = Date.now()

        if (currentTime >= expirationTime) {
          dispatch(setSessionExpired())
          localStorage.removeItem("sessionExpirationTime")
        } else {
          const remainingTime = expirationTime - currentTime
          const timeoutId = setTimeout(() => {
            dispatch(setSessionExpired())
            localStorage.removeItem("sessionExpirationTime")
          }, remainingTime)
          return () => clearTimeout(timeoutId)
        }
      }
    }

    const cleanup = checkSessionExpiration()

    return cleanup
  }, [loggedUser, dispatch])
}
