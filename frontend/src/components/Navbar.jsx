import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        EventScraper
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Home
        </Link>

        {loggedIn && (
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>
        )}

        {/* Login / Logout */}
        {!loggedIn ? (
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
