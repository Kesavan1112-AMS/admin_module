import background from "../assets/images/backgrounds/bg-01.jpg";
import number4 from "../assets/images/font/material-font-4.png";
import number0 from "../assets/images/font/material-font-0.png";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div
      className="select-none min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat text-center px-4"
      style={{ backgroundImage: `url(${background})` }} 
    >
      <div className="flex flex-row items-center space-x-2">
        <img src={number4} alt="Error 4" className="h-32 md:h-48" />
        <img src={number0} alt="Error 0" className="h-32 md:h-48" />
        <img src={number4} alt="Error 4" className="h-32 md:h-48" />
      </div>
      <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mt-3">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Sorry, the page you were looking for could not be found.
        </p>

        <button
          onClick={goHome}
          aria-label="Go Home"
          className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out active:scale-95"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
