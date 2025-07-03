import background from "../assets/images/backgrounds/bg-01.jpg";
import number4 from "../assets/images/font/material-font-4.png";
import number0 from "../assets/images/font/material-font-0.png";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center"
      style={{ 
        backgroundImage: `url(${background})`
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row">
          <img
            src={number4}
            alt="Error 4"
            className="h-32 md:h-48" 
          />
          <img
            src={number0}
            alt="Error 0"
            className="h-32 md:h-48" 
          />
          <img
            src={number4}
            alt="Error 4"
            className="h-32 md:h-48"
          />
        </div>

        <div className="error-container">
          <h1 className="text-3xl md:text-4xl font-bold">Unauthorized</h1>
          <p className="text-lg text-gray-600">
            Sorry you don't have the privilege for this page.
          </p>
          <button
            onClick={goHome}
            aria-label="Go Home"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;