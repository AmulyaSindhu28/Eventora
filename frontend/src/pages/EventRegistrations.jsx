
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, CalendarDays, Mail, UserRound } from "lucide-react";
import api from "../services/api";
import { getEventById } from "../services/eventService";

function EventRegistrations() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!localStorage.getItem("token") || user?.role !== "ORGANIZER") {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [eventData, registrationData] = await Promise.all([
          getEventById(id),
          api.get(`/registrations/event/${id}`)
        ]);

        if (eventData.organizerId !== user.id) {
          setError("You cannot view registrations for another organizer's event.");
          return;
        }

        setEvent(eventData);
        setRegistrations(registrationData.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load event registrations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  if (loading) {
    return <div className="organizer-dashboard">Loading registrations...</div>;
  }

  return (
    <div className="organizer-dashboard">
      <Link to="/organizer-dashboard" className="create-back-link">
        <ArrowLeft size={18} /> Back to dashboard
      </Link>

      {error ? (
        <div className="create-error">{error}</div>
      ) : (
        <>
          <div className="attendee-heading">
            <div>
              <p className="create-eyebrow">EVENT MANAGEMENT</p>
              <h2>{event?.title}</h2>
              <p>Manage and review your event attendees.</p>
            </div>

            <div className="attendee-count-card">
              <Users size={22} />
              <div>
                <strong>{registrations.length}</strong>
                <span>Registrations</span>
              </div>
            </div>
          </div>

          <div className="attendee-summary">
            <div>
              <CalendarDays size={18} />
              <span>{event?.date}</span>
            </div>
            <div>
              <Users size={18} />
              <span>{event?.availableSeats} seats remaining</span>
            </div>
          </div>

          <div className="attendee-table-card">
            <div className="attendee-table-heading">
              <h3>Registered attendees</h3>
              <span>{registrations.length} total</span>
            </div>

            {registrations.length === 0 ? (
              <div className="attendee-empty">
                <Users size={32} />
                <h3>No registrations yet</h3>
                <p>Attendees will appear here when they register.</p>
              </div>
            ) : (
              <div className="attendee-list">
                {registrations.map((registration) => (
                  <div className="attendee-row" key={registration.id}>
                    <div className="attendee-avatar">
                      <UserRound size={19} />
                    </div>

                    <div className="attendee-details">
                      <strong>{registration.userName}</strong>
                      <span>
                        Registration #{registration.id}
                      </span>
                    </div>

                    <div className="attendee-date">
                      <span>Registered</span>
                      <strong>
                        {registration.registrationDate
                          ? new Date(registration.registrationDate).toLocaleString()
                          : "—"}
                      </strong>
                    </div>

                    <span className={`attendee-status ${
                      String(registration.status).toLowerCase()
                    }`}>
                      {registration.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EventRegistrations;
