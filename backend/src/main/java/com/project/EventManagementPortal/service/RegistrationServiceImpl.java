
package com.project.EventManagementPortal.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.EventManagementPortal.dto.RegistrationRequest;
import com.project.EventManagementPortal.dto.RegistrationResponse;
import com.project.EventManagementPortal.entity.Event;
import com.project.EventManagementPortal.entity.Registration;
import com.project.EventManagementPortal.entity.User;
import com.project.EventManagementPortal.enums.EventStatus;
import com.project.EventManagementPortal.enums.RegistrationStatus;
import com.project.EventManagementPortal.enums.UserRole;
import com.project.EventManagementPortal.exception.DuplicateRegistrationException;
import com.project.EventManagementPortal.exception.EventNotFoundException;
import com.project.EventManagementPortal.exception.InvalidOrganizerException;
import com.project.EventManagementPortal.exception.NoSeatsAvailableException;
import com.project.EventManagementPortal.exception.RegistrationNotFoundException;
import com.project.EventManagementPortal.exception.UserNotFoundException;
import com.project.EventManagementPortal.repo.EventRepo;
import com.project.EventManagementPortal.repo.RegistrationRepo;
import com.project.EventManagementPortal.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepo registrationRepository;
    private final UserRepo userRepository;
    private final EventRepo eventRepository;

    @Override
    @Transactional
    public RegistrationResponse registerUser(
            RegistrationRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() ->
                        new EventNotFoundException(
                                "Event not found with id: "
                                        + request.getEventId()));

        // Update event status using its actual scheduled date and time.
        refreshEventStatus(event);

        if (event.getStatus() != EventStatus.UPCOMING) {
            eventRepository.save(event);

            throw new IllegalStateException(
                    "Registration is allowed only for upcoming events");
        }

        // Keep the existing duplicate-registration rule.
        if (registrationRepository.findByUserIdAndEventId(
                user.getId(), event.getId()).isPresent()) {

            throw new DuplicateRegistrationException(
                    "User is already registered for this event");
        }

        // Calculate availability from actual active registrations.
        long registeredCount =
                registrationRepository.countByEventIdAndStatus(
                        event.getId(),
                        RegistrationStatus.REGISTERED);

        int availableSeats =
                event.getCapacity() - (int) registeredCount;

        event.setAvailableSeats(Math.max(availableSeats, 0));

        if (availableSeats <= 0) {
            eventRepository.save(event);

            throw new NoSeatsAvailableException(
                    "No seats available for this event");
        }

        Registration registration = new Registration();

        registration.setUser(user);
        registration.setEvent(event);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus(RegistrationStatus.REGISTERED);

        event.setAvailableSeats(availableSeats - 1);

        eventRepository.save(event);

        Registration savedRegistration =
                registrationRepository.save(registration);

        return convertToResponse(savedRegistration);
    }

    @Override
    public List<RegistrationResponse> getAllRegistrations() {

        return registrationRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationResponse> getMyRegistrations(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        return registrationRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RegistrationResponse getRegistrationById(Long id) {

        Registration registration =
                registrationRepository.findById(id)
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "Registration not found with id: " + id));

        return convertToResponse(registration);
    }

    @Override
    public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {

        return registrationRepository.findByEventId(eventId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegistrationResponse> getRegistrationsByUser(Long userId) {

        return registrationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelRegistration(Long registrationId, String email) {

        Registration registration =
                registrationRepository.findById(registrationId)
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "Registration not found with id: "
                                                + registrationId));

        if (!registration.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException(
                    "You cannot cancel another user's registration");
        }

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            return;
        }

        Event event = registration.getEvent();

        registration.setStatus(RegistrationStatus.CANCELLED);

        // Save cancellation first, so it is excluded from the count.
        registrationRepository.save(registration);

        refreshEventStatus(event);

        long registeredCount =
                registrationRepository.countByEventIdAndStatus(
                        event.getId(),
                        RegistrationStatus.REGISTERED);

        int availableSeats =
                event.getCapacity() - (int) registeredCount;

        event.setAvailableSeats(Math.max(availableSeats, 0));

        eventRepository.save(event);
    }

    @Override
    public List<RegistrationResponse> getOrganizerEventRegistrations(
            Long eventId, String organizerEmail) {

        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Organizer not found"));

        if (organizer.getRole() != UserRole.ORGANIZER) {
            throw new InvalidOrganizerException(
                    "Only organizers can view event registrations");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new EventNotFoundException(
                                "Event not found with id: " + eventId));

        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            throw new InvalidOrganizerException(
                    "You can only view registrations for your own events");
        }

        return registrationRepository.findByEventId(eventId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private void refreshEventStatus(Event event) {

        if (event.getStatus() == EventStatus.CANCELLED) {
            return;
        }

        LocalDateTime eventDateTime =
                LocalDateTime.of(event.getDate(), event.getTime());

        if (eventDateTime.isBefore(LocalDateTime.now())) {
            event.setStatus(EventStatus.COMPLETED);
        } else {
            event.setStatus(EventStatus.UPCOMING);
        }
    }

    private RegistrationResponse convertToResponse(
            Registration registration) {

        return new RegistrationResponse(
                registration.getId(),
                registration.getUser().getId(),
                registration.getUser().getName(),
                registration.getEvent().getId(),
                registration.getEvent().getTitle(),
                registration.getRegistrationDate(),
                registration.getStatus()
        );
    }
}
