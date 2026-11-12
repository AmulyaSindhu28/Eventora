
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import Navbar from "../components/Navbar";
import EventImage from "../components/EventImage";
import { getEventById } from "../services/eventService";
import { registerForEvent } from "../services/registrationService";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this event.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRegistering(true);
      setMessage("");

      await registerForEvent(event.id);

      setMessage("Successfully registered for this event!");

      const updatedEvent = await getEventById(id);
      setEvent(updatedEvent);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="empty-state">
          <p>Loading event details...</p>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <main className="not-found">
          <h2>Event not found</h2>
          <p>{error || "This event could not be found."}</p>
          <Link className="hero-button" to="/">
            <ArrowLeft size={16} /> Back to events
          </Link>
        </main>
      </>
    );
  }

  const formattedDate = new Date(
    `${event.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />

      <main className="details-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={17} /> Back to events
        </Link>

        <div className="details-layout">
          <section className="details-main">
            <EventImage
              category={event.category}
              title={event.title}
              className="details-image"
            />

            <span className="details-category">
              {event.category}
            </span>

            <h1>{event.title}</h1>

            <p className="details-description">
              {event.description}
            </p>

            <div className="details-info">
              <div>
                <CalendarDays size={20} />
                <span>
                  <small>Date</small>
                  {formattedDate}
                </span>
              </div>

              <div>
                <Clock size={20} />
                <span>
                  <small>Time</small>
                  {event.time}
                </span>
              </div>

              <div>
                <MapPin size={20} />
                <span>
                  <small>Location</small>
                  {event.location}
                </span>
              </div>

              <div>
                <Users size={20} />
                <span>
                  <small>Available seats</small>
                  {event.availableSeats} seats
                </span>
              </div>
            </div>
          </section>

          <aside className="booking-card">
            <p className="section-label">JOIN THE EXPERIENCE</p>
            <h2>Interested in attending?</h2>

            <p>
              Register now and reserve your place at this event.
            </p>

            {message && <p>{message}</p>}

            <button
              className="hero-button booking-button"
              onClick={handleRegister}
              disabled={
                registering ||
                event.availableSeats <= 0 ||
                event.status === "CANCELLED"
              }
            >
              {registering
                ? "Registering..."
                : event.availableSeats <= 0
                ? "No Seats Available"
                : event.status === "CANCELLED"
                ? "Event Cancelled"
                : localStorage.getItem("token")
                ? "Register for Event"
                : "Login to Register"}
            </button>

            {!localStorage.getItem("token") && (
              <p className="booking-note">
                New to Eventora?{" "}
                <Link to="/register">Create an account</Link>
              </p>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

export default EventDetails;
