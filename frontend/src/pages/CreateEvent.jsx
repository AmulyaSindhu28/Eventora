
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Tag,
  FileText,
  Sparkles
} from "lucide-react";

import {
  createEvent,
  getEventCategories
} from "../services/eventService";

function CreateEvent() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

    const loadCategories = async () => {
      try {
        const data = await getEventCategories();
        setCategories(data);
      } catch {
        setError("Unable to load event categories. Please refresh.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Number(formData.capacity) < 1) {
      setError("Capacity must be at least 1.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity)
      };

      await createEvent(payload);

      navigate("/organizer-dashboard", {
        state: { message: "Event created successfully!" }
      });
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message ||
        (typeof data === "string" ? data : null) ||
        "Unable to create event. Please check your details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">

        <Link to="/organizer-dashboard" className="create-back-link">
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>

        <div className="create-event-heading">
          <div className="create-heading-icon">
            <Sparkles size={23} />
          </div>

          <div>
            <p className="create-eyebrow">ORGANIZER WORKSPACE</p>
            <h1>Create an event</h1>
            <p>Bring people together. Start by sharing your event details.</p>
          </div>
        </div>

        <form className="create-event-card" onSubmit={handleSubmit}>

          <div className="create-form-section">
            <div className="create-section-heading">
              <FileText size={19} />
              <div>
                <h3>Basic information</h3>
                <p>Tell attendees what your event is about.</p>
              </div>
            </div>

            <div className="create-field">
              <label htmlFor="title">Event title *</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Annual Tech Fest 2026"
                maxLength="150"
                required
              />
            </div>

            <div className="create-field">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event, activities and what attendees can expect..."
                rows="5"
                required
              />
            </div>

            <div className="create-field">
              <label htmlFor="category">Event category *</label>
              <div className="create-input-icon">
                <Tag size={18} />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map((category) => (
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
                <p>When and where will your event happen?</p>
              </div>
            </div>

            <div className="create-fields-grid">
              <div className="create-field">
                <label htmlFor="date">Event date *</label>
                <div className="create-input-icon">
                  <CalendarDays size={18} />
                  <input
                    id="date"
                    type="date"
                    name="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="create-field">
                <label htmlFor="time">Event time *</label>
                <div className="create-input-icon">
                  <Clock3 size={18} />
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="create-field">
              <label htmlFor="location">Location *</label>
              <div className="create-input-icon">
                <MapPin size={18} />
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter venue or location"
                  maxLength="200"
                  required
                />
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
              <input
                id="capacity"
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 100"
                required
              />
              <span>Available seats will initially match this capacity.</span>
            </div>
          </div>

          {error && (
            <div className="create-error">
              {error}
            </div>
          )}

          <div className="create-form-footer">
            <button
              type="button"
              className="create-cancel-btn"
              onClick={() => navigate("/organizer-dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-submit-btn"
              disabled={submitting || loadingCategories}
            >
              {submitting ? "Creating event..." : "Create event"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
