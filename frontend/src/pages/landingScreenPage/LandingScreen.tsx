import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/Auth";
import { fetchMenuAsync } from "../../contexts/slices/UiConfigSlice";
import backgroundImage from "../../assets/images/backgrounds/LandingScreenImage.jpg";
import LoaderComponent from "../../components/sharedComponents/LoaderComponent";
import DynamicMenuRenderer from "../../components/uiComponents/DynamicMenuRenderer";
import DashboardWidget from "../../components/dashboardComponents/DashboardWidget";

const LandingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { loggedUserInfo } = useSelector((state: RootState) => state.loggedUserInfo);
  const { menuItems, isLoading } = useSelector((state: RootState) => state.uiConfig);

  useEffect(() => {
    if (loggedUserInfo?.userDetails?.companyId && menuItems.length === 0) {
      dispatch(fetchMenuAsync(loggedUserInfo.userDetails.companyId) as any);
    }
  }, [dispatch, loggedUserInfo?.userDetails?.companyId, menuItems.length]);

  if (isLoading) return <LoaderComponent />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Hero Section */}
      <div
        className="relative h-96 flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to {loggedUserInfo?.userDetails?.company?.name || 'Admin Module'}
          </h1>
          <p className="text-xl">
            Hello, {loggedUserInfo?.userDetails?.firstName} {loggedUserInfo?.userDetails?.lastName}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dynamic Menu Section */}
        {menuItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Quick Access
            </h2>
            <DynamicMenuRenderer menuItems={menuItems} variant="cards" />
          </div>
        )}

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardWidget
            title="Total Users"
            value="0"
            icon="users"
            color="blue"
          />
          <DashboardWidget
            title="Active Sessions"
            value="1"
            icon="activity"
            color="green"
          />
          <DashboardWidget
            title="System Health"
            value="100%"
            icon="heart"
            color="green"
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-700 dark:text-gray-300">
                You logged in successfully
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Just now
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-700 dark:text-gray-300">
                System initialized
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
