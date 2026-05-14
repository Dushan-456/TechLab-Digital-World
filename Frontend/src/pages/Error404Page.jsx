import errorimg from "../assets/404.webp";
import { useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineExclamationCircle } from "react-icons/hi";

const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto pt-10 text-center flex flex-col items-center pb-10 justify-center min-h-screen">
      <HiOutlineExclamationCircle className="text-amber-500 text-5xl mb-2" />
      <h1 className="text-2xl font-semibold text-amber-500">Page Not Found.</h1>
      <p className="text-gray-600 mt-2">Sorry ! We couldn't find that page.</p>

      <img src={errorimg} alt="Error 404" className="md:w-1/2 my-6 max-w-sm rounded-lg" />
      
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
      >
        <HiOutlineHome className="text-xl" />
        Go to Home
      </button>
      <br />
      <p className="text-sm text-gray-500">
        Please contact{" "}
        <a href="mailto:admin@digitalwedding.com" className="text-blue-500 font-bold hover:underline">
          System Administrator
        </a>{" "}
        if you believe this is an error in website.{" "}
      </p>
    </div>
  );
};

export default Error404Page;
