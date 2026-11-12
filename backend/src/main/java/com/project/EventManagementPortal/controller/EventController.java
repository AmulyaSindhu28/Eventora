package com.project.EventManagementPortal.controller;

import java.util.List;


import java.util.Arrays;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.EventManagementPortal.dto.EventRequest;
import com.project.EventManagementPortal.dto.EventResponse;
import com.project.EventManagementPortal.enums.EventCategory;
import com.project.EventManagementPortal.enums.EventStatus;
import com.project.EventManagementPortal.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        EventResponse response = eventService.createEvent(
                request,
                userDetails.getUsername());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    // Get All Events
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {

        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Get Event By ID
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Long id) {

        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                eventService.updateEvent(
                        id, request, userDetails.getUsername()));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.deleteEvent(id, userDetails.getUsername());

        return ResponseEntity.ok("Event deleted successfully");
    }
    @GetMapping("/categories")
    public ResponseEntity<List<EventCategory>> getCategories() {
        return ResponseEntity.ok(
                Arrays.asList(EventCategory.values()));
    }

    // Get Events By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EventResponse>> getEventsByStatus(
            @PathVariable EventStatus status) {

        return ResponseEntity.ok(
                eventService.getEventsByStatus(status)
        );
    }

    // Get Events By Location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<EventResponse>> getEventsByLocation(
            @PathVariable String location) {

        return ResponseEntity.ok(
                eventService.getEventsByLocation(location)
        );
    }

    // Search Events By Title
    @GetMapping("/search")
    public ResponseEntity<List<EventResponse>> searchEvents(
    		 @RequestParam String keyword) {

        return ResponseEntity.ok(
                eventService.searchEvents(keyword)
        );
    }
    
    @PutMapping("/{id}/status")
    public EventResponse updateEventStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {

        return eventService.updateEventStatus(
                id,
                status,
                userDetails.getUsername()
        );
    }
}