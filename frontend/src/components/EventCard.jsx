
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import EventImage from "./EventImage";

function EventCard({ event }) {
  const formattedDate = new Date(
    `${event.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="event-card">
      <div className="event-image-wrapper">
        <EventImage
          category={event.category}
          title={event.title}
          className="event-image"
        />

        <span className="category-badge">
          {event.category}
        </span>
      </div>

      <div className="event-content">
        <p className="event-date">{formattedDate}</p>
        <h3>{event.title}</h3>

        <p className="event-description">
          {event.description}
        </p>

        <div className="event-card-bottom">
          <span className="event-location">
            <MapPin size={15} />
            {event.location}
          </span>

          <Link
            className="event-link"
            to={`/events/${event.id}`}
            aria-label={`View ${event.title}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
