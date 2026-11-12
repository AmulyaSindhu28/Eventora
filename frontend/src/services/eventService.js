
import api from "./api";

export const getAllEvents = async () => {
  return (await api.get("/events")).data;
};

export const getEventById = async (id) => {
  return (await api.get(`/events/${id}`)).data;
};

export const getEventCategories = async () => {
  return (await api.get("/events/categories")).data;
};

export const createEvent = async (eventData) => {
  return (await api.post("/events", eventData)).data;
};

export const updateEvent = async (id, eventData) => {
  return (await api.put(`/events/${id}`, eventData)).data;
};

export const deleteEvent = async (id) => {
  return (await api.delete(`/events/${id}`)).data;
};

export const cancelEvent = async (id) =>
  (await api.put(`/events/${id}/status`, null, {
    params: { status: "CANCELLED" },
  })).data;