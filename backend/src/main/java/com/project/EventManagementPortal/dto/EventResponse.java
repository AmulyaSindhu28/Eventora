package com.project.EventManagementPortal.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.project.EventManagementPortal.enums.EventCategory;
import com.project.EventManagementPortal.enums.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDate date;

    private LocalTime time;

    private String location;

    private EventCategory category;

    private Integer capacity;

    private Integer availableSeats;

    private EventStatus status;

    private Long organizerId;

    private String organizerName;
}