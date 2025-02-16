import { FileText } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle navigation for section links
  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-pink-500" />
            <span className="ml-2 text-xl font-bold">
              <Link to="/" className="nav-link">CIRC</Link>
            </span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <button onClick={() => handleNavigation("features")} className="nav-link">Features</button>
              <button onClick={() => handleNavigation("how-it-works")} className="nav-link">How it Works</button>
              <button onClick={() => handleNavigation("examples")} className="nav-link">Examples</button>
              <button onClick={() => handleNavigation("pricing")} className="nav-link">Pricing</button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Show "Sign In" if user is signed out */}
            <SignedOut>
              <button onClick={() => openSignIn()} className="nav-link">
                Sign In
              </button>
            </SignedOut>

            {/* Show Profile & Logout if user is signed in */}
            <SignedIn>
              <Link to="/profile" className="nav-link">Profile</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Get Started Button with Hover Effect */}
            <Link to="/chat" className="primary-button relative group">
              <span className="group-hover:hidden">Get Started</span>
              <span className="hidden group-hover:inline">BETA MODE</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
