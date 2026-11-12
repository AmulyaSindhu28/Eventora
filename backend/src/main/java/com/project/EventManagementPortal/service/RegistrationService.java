
package com.project.EventManagementPortal.service;

import java.util.List;

import com.project.EventManagementPortal.dto.RegistrationRequest;
import com.project.EventManagementPortal.dto.RegistrationResponse;

public interface RegistrationService {

    RegistrationResponse registerUser(
            RegistrationRequest request, String email);

    List<RegistrationResponse> getAllRegistrations();

    RegistrationResponse getRegistrationById(Long id);

    List<RegistrationResponse> getRegistrationsByEvent(Long eventId);

    List<RegistrationResponse> getRegistrationsByUser(Long userId);

    List<RegistrationResponse> getMyRegistrations(String email);

    void cancelRegistration(Long registrationId, String email);
    
    List<RegistrationResponse> getOrganizerEventRegistrations(
            Long eventId, String organizerEmail);
}
