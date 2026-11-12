
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Ticket,
  LogOut,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getMyRegistrations, cancelMyRegistration } from "../services/registrationService";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "USER") {
      loadRegistrations();
    } else {
      setLoading(false);
    }
  }, []);

  const loadRegistrations = async () => {
    try {
      const data = await getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load your registrations.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    try {
      await cancelMyRegistration(registrationId);
      setRegistrations((current) =>
        current.map((item) =>
          item.id === registrationId
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to cancel registration."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!token || !user) return null;

  const activeRegistrations = registrations.filter(
    (item) => item.status === "REGISTERED"
  );

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-heading">
          <div>
            <p className="section-label">YOUR SPACE</p>
            <h1>Welcome, {user.name}!</h1>
            <p className="section-description">
              {user.email} · {user.role}
            </p>
          </div>

          <button className="text-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {user.role === "USER" ? (
          <section>
            <div className="dashboard-section-heading">
              <h2>My Registrations</h2>
              <Link className="text-link" to="/">
                Explore events
              </Link>
            </div>

            {loading ? (
              <p>Loading your registrations...</p>
            ) : error ? (
              <p>{error}</p>
            ) : activeRegistrations.length === 0 ? (
              <div className="dashboard-empty">
                <Ticket size={30} />
                <h3>No active registrations</h3>
                <p>Explore events and find something you love.</p>
                <Link className="hero-button" to="/">
                  Browse events
                </Link>
              </div>
            ) : (
              <div className="dashboard-list">
                {activeRegistrations.map((registration) => (
                  <article
                    className="dashboard-event"
                    key={registration.id}
                  >
                    <div className="dashboard-event-info">
                      <span className="details-category">
                        {registration.status}
                      </span>

                      <h3>{registration.eventTitle}</h3>

                      <p>
                        <CalendarDays size={14} />
                        {new Date(
                          registration.registrationDate
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="dashboard-event-actions">
                      <Link
                        className="text-link"
                        to={`/events/${registration.eventId}`}
                      >
                        View Event
                      </Link>

                      <button
                        className="text-button"
                        onClick={() => handleCancel(registration.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : user.role === "ORGANIZER" ? (
          <section>
            <h2>Organizer Dashboard</h2>
            <p>Welcome to your event management space.</p>
          </section>
        ) : (
          <p>Invalid user role.</p>
        )}

        <Link className="dashboard-back" to="/">
          <ArrowLeft size={16} /> Back to events
        </Link>
      </main>
    </>
  );
}

export default Dashboard;
