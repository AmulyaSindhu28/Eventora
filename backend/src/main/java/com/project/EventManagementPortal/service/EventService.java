
package com.project.EventManagementPortal.service;

import java.util.List;

import com.project.EventManagementPortal.dto.EventRequest;
import com.project.EventManagementPortal.dto.EventResponse;
import com.project.EventManagementPortal.enums.EventCategory;
import com.project.EventManagementPortal.enums.EventStatus;

public interface EventService {

    EventResponse createEvent(
            EventRequest request,
            String organizerEmail);

    List<EventResponse> getAllEvents();

    EventResponse getEventById(Long id);

    EventResponse updateEvent(
            Long id,
            EventRequest request,
            String organizerEmail);

    void deleteEvent(
            Long id,
            String organizerEmail);

    EventResponse updateEventStatus(
            Long id,
            EventStatus status,
            String organizerEmail);

    List<EventResponse> getEventsByCategory(
            EventCategory category);

    List<EventResponse> getEventsByStatus(
            EventStatus status);

    List<EventResponse> getEventsByLocation(
            String location);

    List<EventResponse> searchEvents(String keyword);
}
