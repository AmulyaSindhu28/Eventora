
package com.project.EventManagementPortal.controller;

import java.util.List;


import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.project.EventManagementPortal.dto.RegistrationRequest;
import com.project.EventManagementPortal.dto.RegistrationResponse;
import com.project.EventManagementPortal.service.RegistrationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                registrationService.getOrganizerEventRegistrations(
                        eventId, userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<RegistrationResponse> registerUser(
            @Valid @RequestBody RegistrationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        RegistrationResponse response =
                registrationService.registerUser(
                        request, userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                registrationService.getMyRegistrations(
                        userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        registrationService.cancelRegistration(
                id, userDetails.getUsername());

        return ResponseEntity.ok(
                "Registration cancelled successfully");
    }
}
