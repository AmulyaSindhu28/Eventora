
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Plus,
  Users,
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  LogOut,
  Home,
  Tag,
  Ban
} from "lucide-react";

import {
  getAllEvents,
  deleteEvent,
  cancelEvent
} from "../services/eventService";

function OrganizerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    location.state?.message || ""
  );

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      user?.role !== "ORGANIZER"
    ) {
      navigate("/login");
      return;
    }

    fetchOrganizerEvents();
  }, []);

  // Fetch events belonging to the logged-in organizer
  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const allEvents = await getAllEvents();

      const myEvents = allEvents.filter(
        (event) =>
          Number(event.organizerId) === Number(user.id)
      );

      setEvents(myEvents);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load your events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Safe seat calculations
  const totalSeats = events.reduce(
    (sum, event) =>
      sum + Math.max(0, Number(event.capacity) || 0),
    0
  );

  const availableSeats = events.reduce(
    (sum, event) => {
      const capacity = Math.max(
        0,
        Number(event.capacity) || 0
      );

      const available = Math.max(
        0,
        Math.min(
          capacity,
          Number(event.availableSeats) || 0
        )
      );

      return sum + available;
    },
    0
  );

  const registeredCount = totalSeats - availableSeats;

  const upcomingCount = events.filter(
    (event) => event.status === "UPCOMING"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "COMPLETED"
  ).length;

  const cancelledCount = events.filter(
    (event) => event.status === "CANCELLED"
  ).length;

  // Delete event
  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteEvent(eventId);

      setEvents((prev) =>
        prev.filter(
          (event) => event.id !== eventId
        )
      );

      setSuccess("Event deleted successfully!");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : null) ||
        "Unable to delete event. Events with registrations cannot be deleted."
      );
    }
  };

  // Cancel event
  const handleCancelEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this event? Users will no longer be able to register."
    );

    if (!confirmed) return;

    try {
      await cancelEvent(eventId);

      setSuccess("Event cancelled successfully!");
      setError("");

      await fetchOrganizerEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : null) ||
        "Unable to cancel event. Please try again."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="organizer-dashboard">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="organizer-dashboard">

      {/* Header */}
      <header className="organizer-header">

        <div>
          <p className="create-eyebrow">
            EVENTORA WORKSPACE
          </p>

          <h2>Organizer Dashboard</h2>

          <p>
            Welcome back, {user?.name}!
          </p>
        </div>

        <div className="organizer-header-actions">

          <button onClick={() => navigate("/")}>
            <Home size={16} />
            Home
          </button>

          <button onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </header>

      {/* Success message */}
      {success && (
        <div className="organizer-success">
          {success}

          <button
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            ×
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="organizer-error">
          {error}

          <button
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}

      {/* Dashboard statistics */}
      <section className="organizer-stats">

        <div className="organizer-stat-card">
          <span>Total Events</span>
          <h3>{events.length}</h3>
        </div>

        <div className="organizer-stat-card">
          <span>Upcoming Events</span>
          <h3>{upcomingCount}</h3>
        </div>

        <div className="organizer-stat-card">
          <span>Registered Seats</span>
          <h3>{registeredCount}</h3>
        </div>

        <div className="organizer-stat-card">
          <span>Available Seats</span>
          <h3>{availableSeats}</h3>
        </div>

      </section>

      {/* Event management */}
      <section className="organizer-events">

        <div className="organizer-events-heading">

          <div>
            <h3>My Events</h3>

            <p>
              Manage the events you have created.
              {" "}
              {completedCount} completed
              {" · "}
              {cancelledCount} cancelled
            </p>
          </div>

          <button
            className="organizer-create-btn"
            onClick={() =>
              navigate("/organizer/events/create")
            }
          >
            <Plus size={17} />
            Create Event
          </button>

        </div>

        {/* Empty state */}
        {events.length === 0 ? (

          <div className="organizer-empty">

            <CalendarDays size={38} />

            <h3>No events created yet</h3>

            <p>
              Start creating events and bring people together.
            </p>

            <button
              className="organizer-create-btn"
              onClick={() =>
                navigate("/organizer/events/create")
              }
            >
              <Plus size={17} />
              Create Your First Event
            </button>

          </div>

        ) : (

          /* Event cards */
          <div className="organizer-event-list">

            {events.map((event) => {

              const capacity = Math.max(
                0,
                Number(event.capacity) || 0
              );

              const available = Math.max(
                0,
                Math.min(
                  capacity,
                  Number(event.availableSeats) || 0
                )
              );

              const registered = capacity - available;

              return (

                <article
                  className="organizer-event-card"
                  key={event.id}
                >

                  {/* Event information */}
                  <div className="organizer-event-info">

                    <div className="organizer-event-title-row">

                      <h4>{event.title}</h4>

                      <span
                        className={`status-badge ${event.status?.toLowerCase()}`}
                      >
                        {event.status}
                      </span>

                    </div>

                    <p className="organizer-event-description">
                      {event.description}
                    </p>

                    {/* Event metadata */}
                    <div className="organizer-event-meta">

                      <div>
                        <CalendarDays size={16} />

                        <span>
                          <small>Event date</small>
                          {event.date}
                        </span>
                      </div>

                      <div>
                        <MapPin size={16} />

                        <span>
                          <small>Location</small>
                          {event.location}
                        </span>
                      </div>

                      <div>
                        <Users size={16} />

                        <span>
                          <small>Seats available</small>
                          {available} / {capacity}
                        </span>
                      </div>

                      <div>
                        <Tag size={16} />

                        <span>
                          <small>Category</small>
                          {event.category}
                        </span>
                      </div>

                    </div>

                    <p className="organizer-registration-summary">
                      {registered} registered out of {capacity} seats
                    </p>

                  </div>

                  {/* Event actions */}
                  <div className="organizer-event-actions">

                    <Link to={`/events/${event.id}`}>
                      <Eye size={15} />
                      View
                    </Link>

                    {event.status === "UPCOMING" && (
                      <button
                        onClick={() =>
                          navigate(
                            `/organizer/events/edit/${event.id}`
                          )
                        }
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                    )}

                    <Link
                      to={`/organizer/events/${event.id}/registrations`}
                    >
                      <Users size={15} />
                      Attendees
                    </Link>

                    {/* Cancel only upcoming events */}
                    {event.status === "UPCOMING" && (
                      <button
                        className="organizer-cancel-btn"
                        onClick={() =>
                          handleCancelEvent(event.id)
                        }
                      >
                        <Ban size={15} />
                        Cancel Event
                      </button>
                    )}

                    {/* Delete only events without registrations */}
                    {registered === 0 && (
                      <button
                        className="organizer-delete-btn"
                        onClick={() =>
                          handleDelete(event.id)
                        }
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    )}

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default OrganizerDashboard;
