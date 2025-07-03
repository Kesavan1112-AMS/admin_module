import React from "react";
import backgroundImage from "../../assets/images/backgrounds/LandingScreenImage.jpg";
import LoaderComponent from "../../components/sharedComponents/LoaderComponent";

const LandingScreen: React.FC = () => {
  const isLoading = false;

  if (isLoading) return <LoaderComponent />;

  return (
    <div
      className="flex flex-col items-center min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "top",
        backgroundSize: "cover",
        userSelect: "none",
      }}
    ></div>
  );
};

export default LandingScreen;
