import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import FileUploader from "../components/FileUploader"; // Import FileUploader

const FreeTrialAuth = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/"); // Redirect to home if not authenticated
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* <div className="max-w-md p-8 bg-gray-800 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Free Trial</h2>
        <p className="text-gray-300 mb-6">
          You're authenticated! Upload your files and explore the trial.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 mb-6"
        >
          Go to Home
        </button>
      </div> */}

      {/* File Uploader Section */}
      <div className="w-full max-w-4xl mt-8">
        <FileUploader />
      </div>
    </div>
  );
};

export default FreeTrialAuth;
