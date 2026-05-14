import { useNavigate } from "react-router-dom";
import errorimage from "../assets/error403.jpg";
import { HiOutlineHome, HiOutlineExclamationCircle } from "react-icons/hi";

const Error403Page = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto pt-10 text-center flex flex-col items-center h-screen pb-10 justify-center">
      <HiOutlineExclamationCircle className="text-red-600 text-5xl mb-2" />
      <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
      <p className="text-gray-600 mt-2">
        You do not have permission to view this page.
      </p>
      
      {/* We keep the image but you might want to remove it or update the asset */}
      <img src={errorimage} alt="Error 403" className="my-6 max-w-sm rounded-lg shadow-md" />
      
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

export default Error403Page;
