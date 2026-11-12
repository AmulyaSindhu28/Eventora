
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const dashboardPath =
    user?.role === "ORGANIZER"
      ? "/organizer-dashboard"
      : "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-icon">
          <CalendarDays size={21} />
        </span>

        <span>
          Eventora<span className="brand-dot">.</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link className="nav-active" to="/">
          Discover
        </Link>

        <a href="/#events">Events</a>
        <a href="/#about">About</a>
      </nav>

      <div className="nav-actions">
        {token && user ? (
          <>
            <Link
              className="login-link dashboard-nav-link"
              to={dashboardPath}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <button
              className="signup-button navbar-logout"
              onClick={handleLogout}
            >
              Logout <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link className="login-link" to="/login">
              Log in
            </Link>

            <Link className="signup-button" to="/register">
              Get Started <ArrowUpRight size={16} />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
