import { useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { IoMdKey } from "react-icons/io";
import { logout } from "../../contexts/slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/Auth";
import { MdOutlineQuestionMark } from "react-icons/md";
import { MdMail } from "react-icons/md";
import { Menu, MenuItem } from "../sharedComponents/Menu";
import Button from "../sharedComponents/Button";
import { clearDateInfo } from "../../contexts/slices/DataTillSlice";
import toast from "react-hot-toast";

// import axios from "axios";

const AccountTheme = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const loggedUser = useSelector(
    (state: RootState) => state.loggedUserInfo.loggedUser
  );

  const handleLogout = async () => {
    try {
      if (loggedUser) {
        await dispatch(clearDateInfo());
        await dispatch(
          logout({
            userId: loggedUser.id,
            sessionId: loggedUser.sessionId,
          })
        );
        sessionStorage.removeItem("loggedUser");

        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setDialogOpen(true);
  };

  const handleDownload = () => {
    const fileUrl =
      "https://samimongo.s3.ap-southeast-1.amazonaws.com/Cockpit/Support_Demo_Ppt.pptx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "support.pptx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  return (
    <>

      <div className="relative">
        <div className="flex gap-2" onClick={() => setIsOpen(!isOpen)}>
          <button
            ref={buttonRef}
            className="flex items-center justify-center w-10 h-10 bg-cyan-600 text-white rounded-full"
          >
            {loggedUser?.name?.charAt(0).toUpperCase()}
          </button>
          {loggedUser?.userType === "Admin" && (
            <div className="flex flex-col">
              <span className="text-md font-semibold text-[#495B7F]">
                Admin
              </span>
              <span className="text-[#495B7F] mr-2 text-sm font-semibold">
                National Manager
              </span>
            </div>
          )}
        </div>
        <Menu
          anchorEl={buttonRef.current}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          position="bottom"
          offsetY={loggedUser?.userType === "Admin" ? 20 : 15}
          offsetX={loggedUser?.userType === "Admin" ? -25 : -140}
        >
          <MenuItem
            component={Button}
            variant="text"
            color="secondary"
            className="w-full !justify-start px-4 py-3 text-sm font-medium !text-gray-700 hover:!bg-gray-100 hover:!text-gray-900 dark:!text-white dark:hover:!bg-gray-600 gap-3 !cursor-default"
            startIcon={<MdPerson size={20} className="flex-shrink-0" />}
          >
            {loggedUser?.name || ""}
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            component={Button}
            variant="text"
            color="secondary"
            className="w-full mr-2 !justify-start px-4 py-3 text-sm font-medium !text-gray-700 hover:!bg-gray-100 hover:!text-gray-900 dark:!text-white dark:hover:!bg-gray-600 gap-3"
            startIcon={<FiLogOut size={20} className="flex-shrink-0" />}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default AccountTheme;
