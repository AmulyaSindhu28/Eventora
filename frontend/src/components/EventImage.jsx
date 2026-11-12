
import React, { useState, useEffect } from "react";

const eventImages = {
  TECHNOLOGY:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",

  MUSIC:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",

  SPORTS:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",

  WORKSHOP:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",

  BUSINESS:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",

  CONFERENCE:
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",

  CULTURAL:
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",

  OTHER:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
};

const getEventImage = (category) => {
  const value = String(category || "").toUpperCase();

  if (value.includes("TECH")) return eventImages.TECHNOLOGY;
  if (value.includes("MUSIC")) return eventImages.MUSIC;
  if (value.includes("SPORT")) return eventImages.SPORTS;
  if (value.includes("WORKSHOP")) return eventImages.WORKSHOP;
  if (value.includes("CONFERENCE")) return eventImages.CONFERENCE;
  if (value.includes("BUSINESS")) return eventImages.BUSINESS;
  if (value.includes("CULTUR")) return eventImages.CULTURAL;

  return eventImages.OTHER;
};

function EventImage({ category, title = "Event", className = "" }) {
  const [imageSrc, setImageSrc] = useState(getEventImage(category));

  useEffect(() => {
    setImageSrc(getEventImage(category));
  }, [category]);

  return (
    <img
      src={imageSrc}
      alt={`${title} event`}
      className={className}
      onError={() => {
        if (imageSrc !== eventImages.OTHER) {
          setImageSrc(eventImages.OTHER);
        }
      }}
    />
  );
}

export default EventImage;
