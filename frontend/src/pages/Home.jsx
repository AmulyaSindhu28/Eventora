
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { getAllEvents } from "../services/eventService";

const categories = [
  "All Events",
  "TECHNICAL",
  "CULTURAL",
  "SPORTS",
  "WORKSHOP",
  "CONFERENCE",
  "OTHER",
];

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All Events");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError(
          "Unable to load events. Please check whether the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All Events" ||
        event.category === selectedCategory;

      const searchText = search.trim().toLowerCase();

      const matchesSearch = [
        event.title,
        event.location,
        event.category,
        event.status,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchText)
      );

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, search]);

  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={15} />
              YOUR NEXT EXPERIENCE STARTS HERE
            </span>

            <h1>
              Find your next
              <br />
              <span>great experience.</span>
            </h1>

            <p className="hero-description">
              Discover inspiring events, meet like-minded
              people, and make every moment count.
            </p>

            <a className="hero-button" href="#events">
              Explore events <ArrowRight size={17} />
            </a>

            <p className="hero-note">
              Discover. Connect. Experience.
            </p>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85"
              alt="People enjoying a live event"
            />

            <div className="floating-note">
              <span className="floating-dot" />
              Your next memorable moment awaits.
            </div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <p className="section-label">EXPLORE</p>
              <h2>Events worth attending.</h2>
              <p className="section-description">
                Find something exciting happening near you.
              </p>
            </div>

            <div className="event-count">
              {filteredEvents.length} events
            </div>
          </div>

          <div className="event-toolbar">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-button selected"
                      : "category-button"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "All Events"
                    ? category
                    : category.charAt(0) +
                      category.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <label className="search-box">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search by title, location, category or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          {loading ? (
            <div className="empty-state">
              <RefreshCw size={24} />
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>Something went wrong</h3>
              <p>{error}</p>

              <button
                className="hero-button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No events found</h3>
              <p>Try another search or category.</p>

              <button
                className="hero-button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All Events");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="bottom-cta" id="about">
          <div>
            <p className="section-label">MAKE IT HAPPEN</p>
            <h2>Your next favourite event is waiting.</h2>
          </div>

          <a href="#events" className="hero-button">
            Find an event <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="/">
          <span className="brand-icon">
            <Sparkles size={19} />
          </span>

          <span>
            eventora<span className="brand-dot">.</span>
          </span>
        </a>

        <p>Made for moments that matter.</p>
        <span>© 2026 Eventora</span>
      </footer>
    </>
  );
}

export default Home;
