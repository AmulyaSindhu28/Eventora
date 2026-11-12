
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin, Users, Tag, FileText } from "lucide-react";
import { getEventById, getEventCategories, updateEvent } from "../services/eventService";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!localStorage.getItem("token") || user?.role !== "ORGANIZER") {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [event, categoryList] = await Promise.all([
          getEventById(id),
          getEventCategories()
        ]);

        if (event.organizerId !== user.id) {
          setError("You cannot edit another organizer's event.");
          return;
        }

        setCategories(categoryList);
        setFormData({
          title: event.title || "",
          description: event.description || "",
          date: event.date || "",
          time: event.time?.slice(0, 5) || "",
          location: event.location || "",
          category: event.category || "",
          capacity: String(event.capacity ?? "")
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load event details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Number(formData.capacity) < 1) {
      setError("Capacity must be at least 1.");
      return;
    }

    setSaving(true);

    try {
      await updateEvent(id, {
        ...formData,
        capacity: Number(formData.capacity)
      });

      navigate("/organizer-dashboard", {
        state: { message: "Event updated successfully!" }
      });
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message ||
        (typeof data === "string" ? data : null) ||
        "Unable to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="create-event-page">Loading event details...</div>;
  }

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <Link to="/organizer-dashboard" className="create-back-link">
          <ArrowLeft size={18} /> Back to dashboard
        </Link>

        <div className="create-event-heading">
          <div className="create-heading-icon">
            <FileText size={23} />
          </div>
          <div>
            <p className="create-eyebrow">ORGANIZER WORKSPACE</p>
            <h1>Edit event</h1>
            <p>Update your event details and keep attendees informed.</p>
          </div>
        </div>

        {error && <div className="create-error">{error}</div>}

        {!error && (
          <form className="create-event-card" onSubmit={handleSubmit}>
            <div className="create-form-section">
              <div className="create-section-heading">
                <FileText size={19} />
                <div>
                  <h3>Basic information</h3>
                  <p>Update the title and description of your event.</p>
                </div>
              </div>

              <div className="create-field">
                <label htmlFor="title">Event title *</label>
                <input id="title" name="title" value={formData.title}
                  onChange={handleChange} maxLength="150" required />
              </div>

              <div className="create-field">
                <label htmlFor="description">Description *</label>
                <textarea id="description" name="description"
                  value={formData.description} onChange={handleChange}
                  rows="5" required />
              </div>

              <div className="create-field">
                <label htmlFor="category">Category *</label>
                <div className="create-input-icon">
                  <Tag size={18} />
                  <select id="category" name="category"
                    value={formData.category} onChange={handleChange} required>
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="create-form-divider" />

            <div className="create-form-section">
              <div className="create-section-heading">
                <CalendarDays size={19} />
                <div>
                  <h3>Date and location</h3>
                  <p>Update when and where the event takes place.</p>
                </div>
              </div>

              <div className="create-fields-grid">
                <div className="create-field">
                  <label htmlFor="date">Event date *</label>
                  <div className="create-input-icon">
                    <CalendarDays size={18} />
                    <input id="date" type="date" name="date"
                      value={formData.date} onChange={handleChange} required />
                  </div>
                </div>

                <div className="create-field">
                  <label htmlFor="time">Event time *</label>
                  <div className="create-input-icon">
                    <Clock3 size={18} />
                    <input id="time" type="time" name="time"
                      value={formData.time} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="create-field">
                <label htmlFor="location">Location *</label>
                <div className="create-input-icon">
                  <MapPin size={18} />
                  <input id="location" name="location"
                    value={formData.location} onChange={handleChange}
                    maxLength="200" required />
                </div>
              </div>
            </div>

            <div className="create-form-divider" />

            <div className="create-form-section">
              <div className="create-section-heading">
                <Users size={19} />
                <div>
                  <h3>Event capacity</h3>
                  <p>Set the maximum number of attendees.</p>
                </div>
              </div>

              <div className="create-field create-capacity-field">
                <label htmlFor="capacity">Maximum attendees *</label>
                <input id="capacity" type="number" name="capacity"
                  min="1" value={formData.capacity}
                  onChange={handleChange} required />
                <span>Capacity cannot be lower than the current registered count.</span>
              </div>
            </div>

            <div className="create-form-footer">
              <button type="button" className="create-cancel-btn"
                onClick={() => navigate("/organizer-dashboard")}>
                Cancel
              </button>
              <button type="submit" className="create-submit-btn"
                disabled={saving}>
                {saving ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditEvent;
