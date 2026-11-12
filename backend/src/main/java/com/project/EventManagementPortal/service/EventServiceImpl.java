
package com.project.EventManagementPortal.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.EventManagementPortal.dto.EventRequest;
import com.project.EventManagementPortal.dto.EventResponse;
import com.project.EventManagementPortal.entity.Event;
import com.project.EventManagementPortal.entity.User;
import com.project.EventManagementPortal.enums.EventCategory;
import com.project.EventManagementPortal.enums.EventStatus;
import com.project.EventManagementPortal.enums.RegistrationStatus;
import com.project.EventManagementPortal.enums.UserRole;
import com.project.EventManagementPortal.exception.EventHasRegistrationsException;
import com.project.EventManagementPortal.exception.EventNotFoundException;
import com.project.EventManagementPortal.exception.InvalidOrganizerException;
import com.project.EventManagementPortal.exception.UserNotFoundException;
import com.project.EventManagementPortal.repo.EventRepo;
import com.project.EventManagementPortal.repo.RegistrationRepo;
import com.project.EventManagementPortal.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepo eventRepository;
    private final UserRepo userRepository;
    private final RegistrationRepo registrationRepository;

    @Override
    @Transactional
    public EventResponse createEvent(
            EventRequest request,
            String organizerEmail) {

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Organizer not found"));

        if (organizer.getRole() != UserRole.ORGANIZER) {
            throw new InvalidOrganizerException(
                    "Only organizers can create events");
        }

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setCapacity(request.getCapacity());
        event.setAvailableSeats(request.getCapacity());
        event.setStatus(EventStatus.UPCOMING);
        event.setOrganizer(organizer);

        updateEventData(event);

        return convertToResponse(eventRepository.save(event));
    }

    @Override
    @Transactional
    public List<EventResponse> getAllEvents() {

        List<Event> events = eventRepository.findAll();

        return events.stream()
                .map(this::updateEventData)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventResponse getEventById(Long id) {

        Event event = findEvent(id);

        updateEventData(event);

        return convertToResponse(event);
    }

    @Override
    @Transactional
    public EventResponse updateEvent(
            Long id,
            EventRequest request,
            String organizerEmail) {

        Event event = findEvent(id);

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Organizer not found"));

        if (organizer.getRole() != UserRole.ORGANIZER ||
                !event.getOrganizer().getId().equals(organizer.getId())) {

            throw new InvalidOrganizerException(
                    "You can only update your own events");
        }

        long registeredCount =
                registrationRepository.countByEventIdAndStatus(
                        id, RegistrationStatus.REGISTERED);

        if (request.getCapacity() < registeredCount) {
            throw new IllegalArgumentException(
                    "Capacity cannot be less than the number of registered attendees");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setCapacity(request.getCapacity());

        updateEventData(event);

        return convertToResponse(eventRepository.save(event));
    }

    @Override
    @Transactional
    public void deleteEvent(Long id, String organizerEmail) {

        Event event = findEvent(id);

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Organizer not found"));

        if (organizer.getRole() != UserRole.ORGANIZER ||
                !event.getOrganizer().getId().equals(organizer.getId())) {

            throw new InvalidOrganizerException(
                    "You can only delete your own events");
        }

        if (registrationRepository.existsByEventId(id)) {
            throw new EventHasRegistrationsException(
                    "Cannot delete event because registrations exist. "
                    + "Cancel the event instead.");
        }

        eventRepository.delete(event);
    }

    @Override
    @Transactional
    public EventResponse updateEventStatus(
            Long id,
            EventStatus status,
            String organizerEmail) {

        Event event = findEvent(id);

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Organizer not found"));

        if (organizer.getRole() != UserRole.ORGANIZER ||
                !event.getOrganizer().getId().equals(organizer.getId())) {

            throw new InvalidOrganizerException(
                    "You can only cancel your own events");
        }

        // Refresh the actual event status before cancellation.
        updateEventData(event);

        if (status != EventStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Only event cancellation is allowed through this action");
        }

        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Completed events cannot be cancelled");
        }

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new IllegalStateException(
                    "This event is already cancelled");
        }

        event.setStatus(EventStatus.CANCELLED);

        return convertToResponse(eventRepository.save(event));
    }

    @Override
    @Transactional
    public List<EventResponse> getEventsByCategory(
            EventCategory category) {

        return eventRepository.findByCategory(category)
                .stream()
                .map(this::updateEventData)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<EventResponse> getEventsByStatus(
            EventStatus status) {

        // Refresh statuses before filtering.
        eventRepository.findAll().forEach(this::updateEventData);

        return eventRepository.findByStatus(status)
                .stream()
                .map(this::updateAvailableSeats)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<EventResponse> getEventsByLocation(
            String location) {

        return eventRepository.findByLocationIgnoreCase(location)
                .stream()
                .map(this::updateEventData)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<EventResponse> searchEvents(String keyword) {

        return eventRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::updateEventData)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /*
     * Updates the event status according to its scheduled date and time.
     * Cancelled events are never automatically changed.
     */
    private Event updateEventData(Event event) {

        if (event.getStatus() != EventStatus.CANCELLED) {

            LocalDateTime eventDateTime =
                    LocalDateTime.of(event.getDate(), event.getTime());

            if (eventDateTime.isBefore(LocalDateTime.now())) {
                event.setStatus(EventStatus.COMPLETED);
            } else {
                event.setStatus(EventStatus.UPCOMING);
            }
        }

        return updateAvailableSeats(event);
    }

    /*
     * Registered registrations are the source of truth
     * for available seats.
     */
    private Event updateAvailableSeats(Event event) {

        if (event.getId() == null) {
            event.setAvailableSeats(event.getCapacity());
            return event;
        }

        long registeredCount =
                registrationRepository.countByEventIdAndStatus(
                        event.getId(),
                        RegistrationStatus.REGISTERED);

        int availableSeats =
                event.getCapacity() - (int) registeredCount;

        event.setAvailableSeats(Math.max(availableSeats, 0));

        return event;
    }

    private Event findEvent(Long id) {

        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new EventNotFoundException(
                                "Event not found with id: " + id));
    }

    private EventResponse convertToResponse(Event event) {

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getDate(),
                event.getTime(),
                event.getLocation(),
                event.getCategory(),
                event.getCapacity(),
                event.getAvailableSeats(),
                event.getStatus(),
                event.getOrganizer().getId(),
                event.getOrganizer().getName()
        );
    }
}
