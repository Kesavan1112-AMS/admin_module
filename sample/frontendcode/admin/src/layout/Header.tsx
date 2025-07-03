import type React from "react"
import logo from "../assets/images/logos/Analytics-logo-new.png"
import { Outlet } from "react-router-dom"
import ThemeSwitcher from "../components/headerComponents/ThemeSwitcher"
import DashboardDropdown from "../components/headerComponents/DashboardDropdown"
import LanguageDropdown from "../components/headerComponents/LanguageDropdown"
import ProfileDropdown from "../components/headerComponents/ProfileDropdown"
import SessionExpiredModal from "../components/sharedComponents/SessionExpiredModal"
import { useSessionManager } from "../hooks/UseSessionManager" // Add this import

const Header: React.FC = () => {
  useSessionManager()

  return (
    <div>
      <div className="flex w-full h-16 justify-between px-4 sm:px-5 bg-gray-100 py-2 fixed top-0 left-0 z-60 dark:bg-gray-800 transition-colors duration-300">
        <img src={logo || "/placeholder.svg"} className="w-[145px] h-10 sm:w-21 mt-1" />
        <div className="flex justify-evenly w-64 items-center">
          <DashboardDropdown />
          <LanguageDropdown />
          <ThemeSwitcher />
          <ProfileDropdown />
        </div>
      </div>
      <SessionExpiredModal />
      <Outlet />
      <SessionExpiredModal />
    </div>
  )
}

export default Header
