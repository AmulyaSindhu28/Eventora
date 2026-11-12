package com.project.EventManagementPortal.dto;

import java.time.LocalDateTime;

import com.project.EventManagementPortal.enums.RegistrationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {

    private Long id;

    private Long userId;

    private String userName;

    private Long eventId;

    private String eventTitle;

    private LocalDateTime registrationDate;

    private RegistrationStatus status;
}